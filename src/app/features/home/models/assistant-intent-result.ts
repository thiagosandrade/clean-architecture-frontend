import { AssistantIntent } from "../../../core/enums/assistant-intent.enum";

export interface AssistantIntentResult {

    intent: AssistantIntent;

    query?: string;

}