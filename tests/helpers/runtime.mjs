import fs from 'node:fs/promises';
import vm from 'node:vm';

/** Load complete ES modules and their dependencies in a deterministic browser context. */
export async function loadRuntime(name, globals) {
  const context = vm.createContext(globals);
  const modules = new Map();
  async function load(url) {
    if (modules.has(url.href)) return modules.get(url.href);
    const module = new vm.SourceTextModule(await fs.readFile(url, 'utf8'), {
      context, identifier: url.href,
    });
    modules.set(url.href, module);
    await module.link((specifier, parent) => load(new URL(specifier, parent.identifier)));
    return module;
  }
  const url = new URL(`../../js/modules/${name}.js`, import.meta.url);
  const module = await load(url);
  await module.evaluate();
  return module.namespace;
}

export async function runInitializer(name, initializer, globals) {
  const namespace = await loadRuntime(name, globals);
  const result = namespace[initializer](globals.document);
  // Every event harness also verifies that repeated initialization is harmless.
  namespace[initializer](globals.document);
  return result;
}
