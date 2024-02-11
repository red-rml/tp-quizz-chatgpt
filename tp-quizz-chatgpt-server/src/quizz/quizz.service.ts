import { Injectable } from '@nestjs/common';
import { OpenAIService } from 'nestjs-openai';

@Injectable()
export class QuizzService {
  constructor(private readonly openai: OpenAIService) {}

  async generateQuizz(
    topics: string[],
    difficulty: string,
    isMultiple: boolean,
  ): Promise<string> {
    try {
      const { data } = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'assistant',
            content: `Liste de sujet : ${topics}.
            Niveau de difficulté : ${difficulty}.
            Option de sujet multiple : ${isMultiple ? 'oui' : 'non'}.
            
            Tu dois préparer un quizz de 10 questions en respectant obligatoirement le format json suivant : 
            {
            "questions": [
                {
                  "question": "Quel film a remporté l'Oscar du meilleur film en 1994 ?",
                  "reponses": ["Forrest Gump", "Pulp Fiction", "La Liste de Schindler", "Le Roi Lion"],
                  "bonne_reponse": "Forrest Gump",
                  "sujet": "cinéma"
                },
             ]
            }
            
            Consigne pour générer ce quizz, utilise le niveau de difficulté mentionné au début.  Chaque question comporte 4 réponses possibles et une seule réponse est correcte. Si l'option de sujet multiple est à "oui", alors tu peux choisir des questions sur tout les sujets mentionné au début. Sinon, si c'est à "non", tu dois choisir un seul sujet parmi la liste mentionné au début pour toute les questions du quizz.`,
          },
        ],
        stream: false,
      });

      return data.choices[0].message.content;
    } catch (error) {
      console.error(error.response);
    }
  }
}
