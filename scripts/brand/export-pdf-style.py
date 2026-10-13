"""Extract decoration paths/gradients from preview2.pdf; omit raster images and text.

Run with the bundled Python runtime. All output uses original PDF coordinates.
"""
import copy
import json
import math
import re
from pathlib import Path
from pypdf import PdfReader
from pypdf.generic import ContentStream

ROOT = Path(__file__).resolve().parents[2]
PDF = PdfReader(ROOT / 'mausac/preview2.pdf')
OUT = ROOT / 'public/images/brand/pdf'
OUT.mkdir(parents=True, exist_ok=True)

def matrix(a, b):
    A,B,C,D,E,F = a; x,y,z,w,u,v = b
    return [A*x+C*y,B*x+D*y,A*z+C*w,B*z+D*w,A*u+C*v+E,B*u+D*v+F]

def point(m, x, y):
    return (m[0]*x+m[2]*y+m[4], m[1]*x+m[3]*y+m[5])

def nums(v): return ' '.join(f'{float(x):.7g}' for x in v)
def color(v):
    v = list(v)
    if len(v)==1: v *= 3
    return 'rgb('+','.join(f'{max(0,min(1,float(x)))*255:.5f}' for x in v)+')'

def function(f, t):
    f=f.get_object(); typ=int(f['/FunctionType'])
    if typ==2:
        u=max(0,min(1,t))**float(f['/N'])
        return [float(a)+(float(b)-float(a))*u for a,b in zip(f['/C0'],f['/C1'])]
    if typ==3:
        bounds=[0]+list(map(float,f['/Bounds']))+[1]
        i=next((i for i in range(len(bounds)-1) if t<=bounds[i+1]),len(bounds)-2)
        a,b=map(float,f['/Encode'][2*i:2*i+2]); u=(t-bounds[i])/(bounds[i+1]-bounds[i])
        return function(f['/Functions'][i],a+(b-a)*u)
    raise ValueError(f'Unsupported function {typ}')

class Extractor:
    def __init__(self): self.defs=[]; self.nodes=[]; self.counter=0
    def ident(self,prefix): self.counter+=1; return f'{prefix}{self.counter}'
    def gradient(self, shade, ctm):
        shade=shade.get_object(); k=self.ident('gradient'); c=list(map(float,shade['/Coords']))
        attr=f'id="{k}" gradientUnits="userSpaceOnUse" gradientTransform="matrix({nums(ctm)})" color-interpolation="sRGB"'
        if int(shade['/ShadingType'])==2:
            tag='linearGradient'; attr+=f' x1="{c[0]}" y1="{c[1]}" x2="{c[2]}" y2="{c[3]}"'
        else:
            tag='radialGradient'; attr+=f' fx="{c[0]}" fy="{c[1]}" fr="{c[2]}" cx="{c[3]}" cy="{c[4]}" r="{c[5]}"'
        count=16
        while True:
            samples=[function(shade['/Function'],i/count) for i in range(count+1)]
            error=max(max(abs(c-((1-u)*a+u*b))*255 for c,a,b in zip(function(shade['/Function'],(i+u)/count),samples[i],samples[i+1])) for i in range(count) for u in [.25,.5,.75])
            if error<.25:break
            count*=2
        stops=''.join(f'<stop offset="{i/count:.8f}" stop-color="{color(samples[i])}"/>' for i in range(count+1))
        self.defs.append(f'<{tag} {attr}>{stops}</{tag}>'); return k
    def parse(self, stream, resources, start=None, mask=False):
        state={'ctm':start or [1,0,0,1,0,0],'fill':[0],'stroke':[0],'opacity':1,'strokeOpacity':1,'width':1,'clips':[],'clipBounds':[],'mask':None,'blend':'normal'}
        stack=[]; path=[]; points=[]; pending=False; text=False; current=(0,0); result=[]
        def add_path(op, a):
            nonlocal current
            if op=='h': path.append('Z'); return
            if op=='re':
                x,y,w,h=map(float,a)
                for k,(u,v) in enumerate([(x,y),(x+w,y),(x+w,y+h),(x,y+h)]): add_path('m' if k==0 else 'l',[u,v])
                path.append('Z'); return
            if op=='v': a=[*current,*a];op='c'
            if op=='y': a=[*a,*a[-2:]];op='c'
            current=tuple(map(float,a[-2:])); pp=[point(state['ctm'],float(a[i]),float(a[i+1])) for i in range(0,len(a),2)]
            points.extend(pp); path.append({'m':'M','l':'L','c':'C'}[op]+nums([v for p in pp for v in p]))
        def wrap(node):
            if state['mask']:node=f'<g mask="url(#{state["mask"]})">{node}</g>'
            for c in state['clips']:node=f'<g clip-path="url(#{c})">{node}</g>'
            if state['blend']!='normal':node=f'<g style="mix-blend-mode:{state["blend"]}">{node}</g>'
            return node
        def bbox():
            return [min(p[0] for p in points),min(p[1] for p in points),max(p[0] for p in points),max(p[1] for p in points)] if points else None
        for index,(args,op) in enumerate(ContentStream(stream,PDF).operations):
            op=op.decode(); a=args
            if op=='BT':text=True
            elif op=='ET':text=False
            elif text:continue
            elif op=='q':stack.append(copy.deepcopy(state))
            elif op=='Q':state=stack.pop()
            elif op=='cm':state['ctm']=matrix(state['ctm'],list(map(float,a)))
            elif op in ['m','l','c','v','y','h','re']:add_path(op,a)
            elif op in ['rg','g']:state['fill']=list(map(float,a))
            elif op in ['RG','G']:state['stroke']=list(map(float,a))
            elif op=='SCN' and str(a[0]).startswith('/'):
                pat=resources['/Pattern'][a[0]].get_object()
                state['stroke']='url(#'+self.gradient(pat['/Shading'],list(map(float,pat['/Matrix'])))+')'
            elif op=='w':state['width']=float(a[0])
            elif op in ['W','W*']:pending=op
            elif op=='gs':
                gs=resources['/ExtGState'][a[0]].get_object()
                state['opacity']=float(gs.get('/ca',state['opacity']));state['strokeOpacity']=float(gs.get('/CA',state['strokeOpacity']))
                state['blend']=str(gs.get('/BM','/Normal'))[1:].lower()
                sm=gs.get('/SMask')
                if sm is not None:
                    sm=sm.get_object()
                    if str(sm)=='/None':state['mask']=None
                    else:
                        form=sm['/G'].get_object();mid=self.ident('mask')
                        nodes=self.parse(form,form['/Resources'],matrix(state['ctm'],list(map(float,form.get('/Matrix',[1,0,0,1,0,0])))),True)
                        self.defs.append(f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="-32768" y="-32768" width="65535" height="65535" style="mask-type:luminance">'+''.join(n['svg'] for n in nodes)+'</mask>')
                        state['mask']=mid
            elif op=='sh':
                k=self.gradient(resources['/Shading'][a[0]],state['ctm'])
                node=f'<rect x="-32768" y="-32768" width="65535" height="65535" fill="url(#{k})" opacity="{state["opacity"]}"/>'
                bounds=state['clipBounds']
                box=[max(b[0] for b in bounds),max(b[1] for b in bounds),min(b[2] for b in bounds),min(b[3] for b in bounds)] if bounds else None
                result.append({'index':index,'bbox':box,'kind':'shade','svg':wrap(node)})
            elif op=='Do':
                form=resources.get('/XObject',{}).get(a[0])
                if form and form.get_object().get('/Subtype')=='/Form':
                    form=form.get_object()
                    nested=self.parse(form,form.get('/Resources',resources),matrix(state['ctm'],list(map(float,form.get('/Matrix',[1,0,0,1,0,0])))),mask)
                    for j,n in enumerate(nested):
                        result.append({**n,'index':index+(j+1)/100000,'svg':wrap(f'<g opacity="{state["opacity"]}">{n["svg"]}</g>')})
            elif op in ['f','f*','S','s','B','B*','b','b*','n']:
                if path and op!='n':
                    d=' '.join(path)+(' Z' if op in ['s','b','b*'] else '')
                    fill=color(state['fill']) if op not in ['S','s'] else 'none'
                    stroke=(state['stroke'] if isinstance(state['stroke'],str) else color(state['stroke'])) if op not in ['f','f*'] else 'none'
                    scale=math.sqrt(abs(state['ctm'][0]*state['ctm'][3]-state['ctm'][1]*state['ctm'][2]))
                    node=f'<path d="{d}" fill="{fill}" fill-opacity="{state["opacity"]}" stroke="{stroke}" stroke-opacity="{state["strokeOpacity"]}" stroke-width="{state["width"]*scale}" fill-rule="{"evenodd" if "*" in op else "nonzero"}"/>'
                    result.append({'index':index,'bbox':bbox(),'kind':'path','svg':wrap(node)})
                if pending and path:
                    state['clipBounds'].append(bbox())
                    k=self.ident('clip');self.defs.append(f'<clipPath id="{k}"><path d="{" ".join(path)}" clip-rule="{"evenodd" if pending=="W*" else "nonzero"}"/></clipPath>');state['clips'].append(k)
                path=[];points=[];pending=False
            # Raster images and PDF text are intentionally omitted.
        return result
    def save(self,name,nodes,crop):
        x,y,w,h=crop
        nodes=[n for n in nodes if not n['bbox'] or (n['bbox'][0]<x+w and n['bbox'][2]>x and n['bbox'][1]<y+h and n['bbox'][3]>y)]
        body=''.join(n['svg'] for n in nodes)
        needed=set(re.findall(r'url\(#([^)]*)\)',body));defs={re.search(r'id="([^"]*)"',d)[1]:d for d in self.defs}
        while True:
            deps=set(re.findall(r'url\(#([^)]*)\)',''.join(defs[k] for k in needed)))
            if deps<=needed:break
            needed|=deps
        svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" preserveAspectRatio="none" color-interpolation="sRGB"><defs>'+''.join(defs[k] for k in defs if k in needed)+f'</defs><g transform="translate({-x} {y+h}) scale(1 -1)">'+body+'</g></svg>'
        (OUT/name).write_text(svg,encoding='utf-8')

def export():
    e=Extractor();page=PDF.pages[1];e.nodes=e.parse(page.get_contents(),page['/Resources'])
    (ROOT/'docs/brand/pdf-vector-inventory.json').write_text(json.dumps([{k:v for k,v in n.items() if k!='svg'} for n in e.nodes],indent=2),encoding='utf-8')
    # Original page coordinates. These contain only authored vector decoration.
    background=[n for n in e.nodes if 801<=n['index']<1340]
    e.save('deal-top.svg',background,[99.113,1412,1406.422,81.771])
    e.save('deal-bottom.svg',background,[99.113,1013.22,1406.422,55])
    e.save('deal-label.svg',[n for n in e.nodes if 1340<=n['index']<1660],[109,1426,259,84.19])
    e.save('deal-flame.svg',[n for n in e.nodes if n['index'] in [1580,1656]],[109,1426,59,84.19])
    e.save('showroom-stripes.svg',[n for n in e.nodes if 1764<=n['index']<1850],[18.6223,137.5715,758.183,40.989])
    e.save('showroom-border.svg',[n for n in e.nodes if n['index']==1763],[17.0267,135.976,761.374,44.18])
    e.save('category-title.svg',[n for n in e.nodes if 740<=n['index']<780],[95.026,946.229,203.147,49.542])
    # Sample the exact PDF exponential functions into CSS color stops.
    shade=page['/Resources']['/Shading']
    specifications={'pdf-gradient':(shade['/Sh1'],90),'pdf-pill-gradient':(PDF.pages[0]['/Resources']['/Shading']['/Sh0'],90),'pdf-commitment-gradient':(shade['/Sh0'],180),'pdf-showroom-gradient':(shade['/Sh9'],90),'pdf-tooltip-price-gradient':(PDF.pages[2]['/Resources']['/Shading']['/Sh0'],180),'pdf-tooltip-offer-gradient':(PDF.pages[2]['/Resources']['/Shading']['/Sh2'],180)}
    rows={}
    for name,(s,angle) in specifications.items():
        f=s.get_object()['/Function'];count=16
        while True:
            stops=[function(f,i/count) for i in range(count+1)]
            error=max(max(abs(c-((1-u)*a+u*b))*255 for c,a,b in zip(function(f,(i+u)/count),stops[i],stops[i+1])) for i in range(count) for u in [.25,.5,.75])
            if error<.25:break
            count*=2
        rows[name]={'maxInterpolationError':error,'segments':count,'angle':angle,'stops':stops}
    css='/* Generated from preview2.pdf functions; interpolation in sRGB. */\n:root {\n'+''.join(f'  --{name}: linear-gradient({rows[name]["angle"]}deg in srgb, '+', '.join(color(c)+f' {i/rows[name]["segments"]*100:.7g}%' for i,c in enumerate(rows[name]['stops']))+');\n' for name in rows)+'}\n'
    (ROOT/'src/styles/pdf-gradients.css').write_text(css,encoding='utf-8')
    (ROOT/'docs/brand/pdf-gradients.json').write_text(json.dumps(rows,indent=2),encoding='utf-8')

if __name__=='__main__': export()
