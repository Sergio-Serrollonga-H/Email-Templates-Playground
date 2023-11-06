const partial = `<div class="parent-step display-flex flex-column align-items-center">
        {{#if this.isTrueChildStepEmpty}}
          <div class="connector-container display-flex justify-content-flex-end">
            <div class="horizontal-connector"></div>
          </div>
          <div class="connector"></div>
          <div class="yes-connector">Yes</div>
          <div class="connector"></div>
        {{/if}}
        {{#if this.isFalseChildStepEmpty}}
          <div class="connector-container display-flex justify-content-flex-start">
            <div class="horizontal-connector"></div>
          </div>
          <div class="connector"></div>
          <div class="no-connector">No</div>
          <div class="connector"></div>
        {{/if}}
        {{#ifCond parent.JourneyStepTypeId '===' 3}}
        {{#ifCond this.Id '===' parent.TrueChildStepId}}
          <div class="connector-container display-flex justify-content-flex-end">
            <div class="horizontal-connector"></div>
          </div>
          <div class="connector"></div>
          <div class="yes-connector">Yes</div>
          <div class="connector"></div>
        {{/ifCond}}
        {{#ifCond this.Id '===' parent.FalseChildStepId}}
          <div class="connector-container display-flex justify-content-flex-start">
            <div class="horizontal-connector"></div>
          </div>
          <div class="connector"></div>
          <div class="no-connector">No</div>
          <div class="connector"></div>
        {{/ifCond}}
        {{/ifCond}}
          {{#ifCond this.JourneyStepTypeId '===' 5}}
            <div
              class="journey-task-step node display-flex flex-column align-items-center justify-content-center"
            >
            <div class="icon circle">
              <div class="figure
              {{#if TaskType}}
              blue-background
              {{else}}
              grey-background
              {{/if}}
              ">
                <img src="https://cdn.honeycrm.com/files/1t-tasks-white.svg" alt="task svg">
              </div>
            </div>
            <div class="details">{{ buildJourneyTaskStatement TaskType TaskAssignedTo }}</div>
            <div class="step-name">{{ Name }}</div>
          </div>
          <div class="connector"></div>
          {{/ifCond}}

          {{#ifCond this.JourneyStepTypeId '===' 4}}
          <div
            class="journey-contact-update-step node display-flex flex-column align-items-center justify-content-center"
          >
          <div class="icon circle">
            <div class="figure
            {{#if UpdateValue}}
            blue-background
            {{else}}
            grey-background
            {{/if}}
            ">
            <img src="https://cdn.honeycrm.com/files/4r-user-settings-white.svg" alt="user settings svg">
            </div>
          </div>
          <div class="content">
            {{ buildJourneyContactUpdateStatement UpdateType UpdateValue }}
          </div>
        </div>
        <div class="connector"></div>
      {{/ifCond}} 
        {{#ifCond this.JourneyStepTypeId '===' 3}}
          <div
            class="journey-condition-step node display-flex align-items-center justify-content-center"
          >
            <div class="icon diamond">
              <div class="figure
              {{#if JourneyConditionRules.length}}
              blue-background
              {{else}}
              grey-background
              {{/if}}
              ">
                          <img
              src="https://cdn.honeycrm.com/files/7n-condition-white.svg"
              alt="condition svg"
            />
              </div>
            </div>
            <div class="content display-flex align-items-center">
              <div class="statement-container">
                {{buildJourneyConditionalStatement JourneyConditionRules
                @root/JourneySteps IsConditionUnion}}
              </div>
            </div>
          </div>
          <div class="connector"></div>
        {{/ifCond}}
        {{#ifCond this.JourneyStepTypeId '===' 2}}
          <div
            class="journey-email-step node display-flex flex-column align-items-center justify-content-center"
          >
            <div class="step-details">
              {{#if PreviewImageUrl}}
              <img src="{{ PreviewImageUrl }}" alt="" />
              {{else}}
              <img class="envelop" src="https://cdn.honeycrm.com/files/4k-email-grey.svg" alt="grey svg" />
              {{/if}}
            </div>
            <div class="step-name">
              {{#if Name}}
                {{ Name }}
              {{else}}
                DEFINE EMAIL
              {{/if}}
            </div>
          </div>
          <div class="connector"></div>
      {{/ifCond}}
      {{#ifCond this.JourneyStepTypeId '===' 1}}
      <div
        class="journey-delay-step node display-flex flex-row align-items-center justify-content-center"
      >
        <div class="clock">
          {{#if DelayDuration}}
          <img
            class="time-defined"
            src="https://cdn.honeycrm.com/files/1o-schedule-gradient.svg"
            alt=""
          />
          {{else}}
          <img
            class="time-undefined"
            src="https://cdn.honeycrm.com/files/1o-schedule-grey.svg"
            alt=""
          />
          {{/if}}
        </div>
        <div class="details">
          <span>Delay</span>
          <div>{{ DelayDuration }} {{ DelayDurationType }}</div>
        </div>
      </div>
      <div class="connector"></div>
      {{/ifCond}}
        {{#if this.children}}
          <div class="children-steps display-flex flex-row align-items-flex-start justify-content-center">
            {{#each this.children}} 
              {{> item this parent=../this}} 
            {{/each}}
          </div>
        {{/if}} 
      </div>`;

export default partial;
