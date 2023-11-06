import templateBuilder from "./templateBuilder";
import document_builder from "./template-objects/documentjson";
import Handlebars from "handlebars";
import exportHelpers from "./helpers";
import fs from "fs";

async function main(): Promise<void> {
  try {
    let template = "index";
    let templateData = await templateBuilder.readTemplate(template);
    exportHelpers.registerHelpers();

    let htmlTemplate = await Handlebars.compile(templateData);

    let output = await htmlTemplate(document_builder);

    fs.writeFileSync(`${template}.html`, output);
    console.log("File Sync end");
  } catch (error) {
    console.log("Error: ", error);
  }
}

main();
