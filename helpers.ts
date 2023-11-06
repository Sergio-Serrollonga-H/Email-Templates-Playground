import Handlebars from "handlebars";
import partial from "./partial";

class ExportHelpers {
  registerHelpers() {
    Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
      switch (operator) {
        case "==":
          return v1 == v2 ? options.fn(this) : options.inverse(this);
        case "===":
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case "!=":
          return v1 != v2 ? options.fn(this) : options.inverse(this);
        case "!==":
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case "<":
          return v1 < v2 ? options.fn(this) : options.inverse(this);
        case "<=":
          return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case ">":
          return v1 > v2 ? options.fn(this) : options.inverse(this);
        case ">=":
          return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case "&&":
          return v1 && v2 ? options.fn(this) : options.inverse(this);
        case "||":
          return v1 || v2 ? options.fn(this) : options.inverse(this);
        case "in":
          return v1 in v2 ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    });

    Handlebars.registerHelper("times", function (n, block) {
      if (n == null) {
        n = 1;
      } else {
        n++;
      }
      var index = 0;
      var accum = "";
      for (var i = 0; i < n; ++i) {
        index++;
        accum += block.fn(this, (this.index = index));
      }

      return accum;
    });

    Handlebars.registerHelper("translateSection", function (index) {
      return `translateY(-${(index - 1) * 1237}px);`;
    });

    // Added with: [registration-verification]
    Handlebars.registerHelper("firstName", function (aString) {
      return aString.split(" ")[0];
    });

    // Added with: [missed-activities]
    Handlebars.registerHelper("addCommaFormat", function (aNumber) {
      return aNumber.toLocaleString();
    });

    Handlebars.registerHelper("moneyFormat", function (aNumber) {
      const options = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      };
      return Number(aNumber).toLocaleString("en", options);
    });

    // Added with: [purchase-invoice]
    Handlebars.registerHelper("fixedDecimals", function (aNumber, decimals) {
      return parseFloat(aNumber).toFixed(decimals);
    });

    // Added with: [submission-email-notification]
    Handlebars.registerHelper("noName", function (aString) {
      return aString.trim().length === 0 ? "A contact" : aString;
    });

    Handlebars.registerHelper("safeString", function (text) {
      return new Handlebars.SafeString(text);
    });

    Handlebars.registerHelper("add", function (v1: number, v2: number) {
      return v1 + v2;
    });

    Handlebars.registerHelper("convertPtsToPxs", function (pts) {
      return pts * (96 / 72);
    });

    Handlebars.registerHelper(
      "buildJourneyConditionalStatement",
      function (objects, journeySteps, isUnion) {
        if (objects) {
          const statements = objects.map((obj) => {
            const matchingJourneyStep = journeySteps.find(
              (s) => s.Id === parseInt(obj.Target)
            );
            const target = matchingJourneyStep
              ? matchingJourneyStep.Name
              : "No step name";

            if (isNaN(obj.Target)) {
              return `<span class="hightlighted"> ${obj.Target}</span> ${obj.Condition}<span class="hightlighted"> ${obj.Value}</span> `;
            } else {
              return `<span class="hightlighted"> ${target}</span> ${obj.Condition} `;
            }
          });

          if (statements.length === 0) {
            return "Define condition rules";
          }

          const operator = isUnion ? "OR" : "AND";
          const fullStatement =
            statements.length > 2
              ? statements.slice(0, 2).join(operator) + operator + "..."
              : statements.join(operator) + "?";

          return new Handlebars.SafeString(fullStatement);
        } else {
          return "Define condition rules";
        }
      }
    );

    Handlebars.registerHelper(
      "buildJourneyTaskStatement",
      function (taskType, taskAssignedTo) {
        let statement = "";

        if (taskType && taskAssignedTo) {
          statement = `Assign <span class="bold">${taskType} Task</span> to <span class="bold">${taskAssignedTo}</span>`;
        } else if (taskType) {
          statement = `Assign <span class="bold">${taskType} Task</span>`;
        } else {
          statement = "Define Task";
        }
        return new Handlebars.SafeString(statement);
      }
    );

    Handlebars.registerHelper(
      "buildJourneyContactUpdateStatement",
      function (UpdateType, UpdateValue) {
        let statement = "";

        switch (UpdateType) {
          case null:
            statement = `Define Update Action`;
            break;
          case "ContactStatus":
            statement = `Change Contact Status to <span class="bold">${
              UpdateType ? UpdateType : "No Status"
            }</span>`;
            break;
          case "AddToList":
            if (UpdateValue) {
              statement = `Add to list <span class="bold">${UpdateValue}</span>`;
            } else {
              statement = `Define Update Action`;
            }
            break;
          case "RemoveFromList":
            if (UpdateValue) {
              statement = `Remove from list <span class="bold">${UpdateValue}</span>`;
            } else {
              statement = `Define Update Action`;
            }
            break;
          case "AssignSalesRep":
            if (UpdateValue) {
              if (UpdateType === "CurrentRep") {
                statement = `Assign to current sales rep`;
              } else {
                statement = `Assign to <span class="bold">${UpdateValue}</span>`;
              }
            } else {
              statement = `Unassign sales rep from contact`;
            }
            break;
        }
        return new Handlebars.SafeString(statement);
      }
    );

    Handlebars.registerHelper("wrapObjects", function (objects) {
      const wrappedObjects: any[] = [];
      const objectsMap = new Map(objects.map((obj) => [obj.Id, obj]));

      for (const obj of objects) {
        if (obj.ParentStepId === null || !objectsMap.has(obj.ParentStepId)) {
          wrappedObjects.push(obj);
        } else {
          const parent: any = objectsMap.get(obj.ParentStepId)!;
          if (!parent.children) parent.children = [];
          if (parent.TrueChildStepId === obj.Id) parent.children.unshift(obj);
          else {
            parent.children.push(obj);
          }
        }

        if (obj.JourneyStepTypeId === 3 && obj.TrueChildStepId === null) {
          if (!obj.children) obj.children = [];
          obj.children.push({ isTrueChildStepEmpty: true });
        }

        if (obj.JourneyStepTypeId === 3 && obj.FalseChildStepId === null) {
          if (!obj.children) obj.children = [];
          obj.children.push({ isFalseChildStepEmpty: true });
        }
      }
      return wrappedObjects;
    });

    Handlebars.registerPartial("item", partial);

    Handlebars.registerHelper("mightNotBeUrl", function (type, url) {
      switch (type) {
        case "avatar":
          return (
            url ||
            "https://ci3.googleusercontent.com/proxy/fYH8AYBWaM1x2eejuN-EoRRETk8CtC0-UF0TYTRRaBb7_LlU83475DiAPzB4dHGBXiU_Aj0eWH8F-yTyL9O-h67quPpck87NbOWDBVhmR60xwkn6-F1BesodUmhJuZ_qFie2jpsyoI3xnLdo1cjoAW1bWrBOmt5tx9xIxNl1gz_ZabMK3A=s0-d-e1-ft#https://05ab5854d232fd37cd92-d8310f79ece792c4405f169f3d25ed4a.ssl.cf1.rackcdn.com/Emails/OpportunityWon/avatar.png"
          );
        case "image-placeholder":
          return url || "https://cdn.honeycrm.com/app/image-placeholder.svg";
        default:
          return url;
      }
    });

    Handlebars.registerHelper("isEven", function (conditional) {
      if (conditional % 2 == 0) {
        return true;
      } else {
        return false;
      }
    });

    Handlebars.registerHelper("getPercentage", function (percentage, quantity) {
      return (percentage * quantity) / 100;
    });

    Handlebars.registerHelper("tableAlignment", function (alignment) {
      switch (alignment) {
        case "flex-start":
          return "left";
        case "center":
          return "center";
        case "flex-end":
          return "right";
      }
    });

    Handlebars.registerHelper("renderHtml", function () {
      return "#ffffff";
    });

    Handlebars.registerHelper("replacePxWithPts", function (message) {
      const regex = /(font-size|line-height):(\s)*([0-9]+)/g;
      let counter = 0;
      let match;
      let uniqueMatches = [];
      let uniqueReplacements = [];

      while ((match = regex.exec(message))) {
        const currentSize = match[0];
        const value = match[3];
        const newSize = Math.round(value / (72 / 96));
        if (uniqueMatches.indexOf(currentSize) === -1) {
          uniqueMatches.push(currentSize);
          uniqueReplacements.push(match[1] + ": " + newSize);
        }
      }

      for (const element of uniqueMatches.sort().reverse()) {
        message = message
          .split(element)
          .join(uniqueReplacements.sort().reverse()[counter]);
        counter++;
      }

      return message;
    });
  }
}

const exportHelpers = new ExportHelpers();
export default exportHelpers;
