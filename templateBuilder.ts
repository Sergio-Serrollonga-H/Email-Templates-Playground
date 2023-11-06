import path from "path";

class TemplateBuider {
  async readTemplate(template: string) {
    console.log(`Finding template: ${template}`);

    const fs = require("fs");
    let htmlTemplateData = await fs.readFileSync(
      path.join(__dirname, "html-templates", `${template}.html`),

      "utf8",

      (err, data) => {
        if (err) {
          console.log(`Find Template : ${err}`);

          throw new Error("Read file : Template not found");
        }
        console.log("Data: ", data);
        return data;
      }
    );

    return htmlTemplateData;
  }
}

const templateBuilder = new TemplateBuider();
export default templateBuilder;
