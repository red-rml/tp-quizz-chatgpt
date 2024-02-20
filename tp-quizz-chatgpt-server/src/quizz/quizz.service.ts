import { Injectable } from '@nestjs/common';
import { OpenAIService } from 'nestjs-openai';

@Injectable()
export class QuizzService {
  constructor(private readonly openai: OpenAIService) {}

  generateQuizzPrompt(
    themes: string[],
    difficulty: string,
    useMultipleThemes: boolean,
    numberOfQuestions: number,
  ): string {
    const themeOptions = themes.map((theme) => `"${theme}"`).join(', ');

    const prompt = `
      Création d'un quizz sur un thème${useMultipleThemes ? 's' : ''}

      Instructions : Créez un quizz avec ${useMultipleThemes ? 'un ou plusieurs' : 'un seul'} thème${useMultipleThemes ? 's' : ''} parmi les options suivantes : ${themeOptions}. Vous devez spécifier ${useMultipleThemes ? 'les thèmes' : 'le thème'} du quizz et de difficulté ${difficulty} et le nombre de questions (${numberOfQuestions}), puis écrire 10 questions, chacune avec 4 réponses possibles, la bonne réponse et un indice pour chaque question, ainsi qu'une explication lié à la bonne réponse à la question pour chaque question en mentionnant la bonne réponse. Respectez le format JSON suivant et en renvoyant uniquement le JSON généré:
      
      [
        {
          "question": "Votre_question",
          "explication": "Explication de la réponse à votre question.",
          "reponses": ["Réponse_1", "Réponse_2", "Réponse_3", "Réponse_4"],
          "bonne_reponse": "Bonne_réponse",
          "sujet": "Thème",
          "indice": "Indice"
        },
        ...
      ]
      

      Exemple :

      
      [
        {
          "question": "Quel est le sport le plus populaire au Brésil ?",
          "explication": "Le football est le sport le plus populaire au Brésil, souvent considéré comme une véritable passion nationale.",
          "reponses": ["Football", "Basketball", "Tennis", "Golf"],
          "bonne_reponse": "Football",
          "sujet": "sport"
        },
        {
          "question": "Qui a remporté le Super Bowl 2020 ?",
          "explication": "Les Kansas City Chiefs ont remporté le Super Bowl 2020 en battant les San Francisco 49ers lors de la 54e édition du Super Bowl.",
          "reponses": ["Kansas City Chiefs", "San Francisco 49ers", "New England Patriots", "Los Angeles Rams"],
          "bonne_reponse": "Kansas City Chiefs",
          "sujet": "sport"
        },
        ...
      ]
      
      `;

    return prompt;
  }

  async generateQuizz(
    topics: string[],
    difficulty: string,
    isMultiple: boolean,
    numberOfQuestions: number,
  ): Promise<string> {
    try {
      const prompt = this.generateQuizzPrompt(
        topics,
        difficulty,
        isMultiple,
        numberOfQuestions,
      );

      const { data } = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'assistant',
            content: prompt,
          },
        ],
        stream: false,
      });

      return data.choices[0].message.content;
    } catch (error) {
      console.error(error.response);
      return 'Une erreur est survenue lors de la génération du quizz.';
    }
  }
}
