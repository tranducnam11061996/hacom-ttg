// CSS ease: cubic-bezier(.25,.1,.25,1), shared timing with category carousels.
export function carouselEase(value) {
  let low=0,high=1,t=value;
  const curve=(a,b,u)=>3*(1-u)*(1-u)*u*a+3*(1-u)*u*u*b+u*u*u;
  for(let i=0;i<12;i++){t=(low+high)/2;if(curve(.25,.25,t)<value)low=t;else high=t;}
  return curve(.1,1,t);
}
