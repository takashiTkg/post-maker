import { Command, flags } from "@oclif/command";
import { prompt } from "inquirer";
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path'

class Mynewcli extends Command {
  static description = "describe the command here";

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async makeStringParameter(message: string): Promise<string> {
    const { inputString } = await prompt([
      {
        type: "input",
        name: "inputString",
        message: message,
        validate: (value: string) => {
          const isValid = value !== ''
          return isValid || 'Please input.'
        }
      },
    ]);
    return inputString;
  }

  async run() {
    const { args, flags } = this.parse(Mynewcli);

    const slug = await this.makeStringParameter("slug : ");
    const title = await this.makeStringParameter("title : ");
    const intro = await this.makeStringParameter("intro : ");
    this.log(`slug: ${slug}`);
    this.log(`title: ${title}`);
    this.log(`intro: ${intro}`);
    const frontmatter = 
    `---
    \rtitle : '${title}'
    \rintro : '${intro}'
    \rdate : '${new Date().toISOString()}'
    \r---`

    const postDir = join(process.cwd(), "_posts/")
    const postFilePath = join(postDir, `${slug}.mdx`)

    if(!existsSync(postDir)){
      mkdirSync(postDir)
    }
    writeFileSync(postFilePath, frontmatter, {flag: 'wx'})
  }
}

export = Mynewcli;
