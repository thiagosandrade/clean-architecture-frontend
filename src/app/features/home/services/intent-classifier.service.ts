import { Injectable } from '@angular/core';
import { AssistantIntentResult } from '../models/assistant-intent-result';
import { AssistantIntent } from '../../../core/enums/assistant-intent.enum';

@Injectable({
    providedIn: 'root'
})
export class IntentClassifierService {

    classify(question: string): AssistantIntentResult {

        const text = question
            .toLowerCase()
            .trim();

        if (text.includes('today')) {

            return {
                intent: AssistantIntent.Today
            };

        }

        if (text.includes('this week')) {

            return {
                intent: AssistantIntent.ThisWeek
            };

        }

        if (text.includes('high priority')) {

            return {
                intent: AssistantIntent.HighPriority
            };

        }

        if (text.includes('overdue')) {

            return {
                intent: AssistantIntent.Overdue
            };

        }

        if (
            text.includes('what should i work on next')
            || text.includes('next task')
            || text.includes('next work')
        ) {

            return {
                intent: AssistantIntent.NextWork
            };

        }

        if (text.includes('plan my day')) {

            return {
                intent: AssistantIntent.PlanDay
            };

        }

        return {

            intent: AssistantIntent.SemanticSearch,
            query: question

        };

    }

}