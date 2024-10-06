import {
  apply,
  applyTemplates,
  chain,
  externalSchematic,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  strings,
  url
} from '@angular-devkit/schematics';
import {Schema} from "./schema";
import {normalize} from "@angular-devkit/core";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function component(options: Schema): Rule {
  return async () => {

    // fixme: klimo-v
    // When I run the schematics in a different directory from the root that contains the angular.json file,
    // I encounter the following error in the console: 'Path "/angular.json" does not exist.'
    // The error is thrown when executing getWorkspace(host).
    // const workspace = await getWorkspace(host);

    // fixme: klimo-v
    // We should call the schematics from the root Angular directory because it cannot find the angular.json otherwise

    const rules = [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: options.name,
        prefix: options.prefix
      }),
      move(normalize(`/${options.path}/${strings.dasherize(options.name)}`))
    ];

    const templateSource = apply(url('./files'), rules);
    return chain([
      externalSchematic('@schematics/angular', 'component', options),
      mergeWith(templateSource, MergeStrategy.Overwrite)
    ])
  }
}
