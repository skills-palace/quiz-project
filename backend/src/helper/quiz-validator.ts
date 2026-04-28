type RearrangeOpts = { alternativeSequences?: string[][] };

const ordersMatch = (a: string[] | undefined, b: string[] | undefined) =>
  Array.isArray(a) &&
  Array.isArray(b) &&
  a.length === b.length &&
  a.every((id, i) => id === b[i]);

const quizValidator = (
  type: string,
  mainQuiz: any,
  userAnswers: any,
  opts: RearrangeOpts = {}
) => {
  let mark = 0;
  let obtainMark = 0;

  if (type == "group_sort" || type === "classification") {
    mark = mainQuiz.reduce(
      (acc: number, group: any) =>
        (acc += group.items.reduce(
          (acc2: number, item: any) => (acc2 += item.mark),
          0
        )),
      0
    );

    const validate = userAnswers.map((answer: any) => {
      const answerGroup = mainQuiz.find((group: any) => group.id === answer.id);

      if (!answerGroup)
        return {
          status: 2,
          answers: [],
        };

      const getGroupItem = (id: string) => {
        let groupItem: any;
        mainQuiz.forEach((group: any) => {
          const item = group.items.find((item: any) => item.id === id);
          if (item) {
            groupItem = { item, groupId: group.id };
          }
        });
        return groupItem;
      };

      const answers = answer.items.map((id: string) => {
        const userAnswer = getGroupItem(id);

        if (!userAnswer) return { status: 2 };

        const isRight = userAnswer.groupId === answer.id;

        if (isRight) obtainMark += userAnswer.item.mark;

        return { title: userAnswer.item.title, status: isRight ? 1 : 0 };
      });

      return {
        name: answerGroup.name,
        answers,
      };
    });
    return { quiz_items: validate, mark, obtainMark };
  }

  if (type == "rearrange" || type == "reorder" || type === "word_bank") {
    const primaryOrder = (mainQuiz || []).map((q: any) => q.id);
    const alts = Array.isArray(opts?.alternativeSequences)
      ? opts.alternativeSequences
      : [];
    const sameLen = (seq: string[]) => seq && seq.length === primaryOrder.length;
    const seen = new Set<string>();
    const uniqueOrders: string[][] = [];
    for (const seq of [primaryOrder, ...alts]) {
      if (!Array.isArray(seq) || !sameLen(seq)) continue;
      const k = seq.join("\u0001");
      if (seen.has(k)) continue;
      seen.add(k);
      uniqueOrders.push(seq);
    }

    const userIds: string[] = (userAnswers || []) as any;
    const fullMatch = uniqueOrders.some((ord) => ordersMatch(ord, userIds));

    const correctWords = (mainQuiz || []).map((q: any) => q?.title).filter(Boolean);
    const toSentence = (idSeq: string[]) =>
      idSeq
        .map((id) => (mainQuiz || []).find((q: any) => q.id === id)?.title)
        .filter(Boolean)
        .join(" ");
    const correctTexts = uniqueOrders.map((ord) => toSentence(ord));

    const validate = (userAnswers || []).map((answer: any, idx: any) => {
      const mainAns = mainQuiz[idx];
      const ansQuiz = mainQuiz.find((q: any) => q.id === answer);

      if (!mainAns) {
        return {
          status: 0,
          expectedTitle: undefined,
        };
      }

      if (fullMatch) {
        mark += mainAns.mark;
        obtainMark += mainAns.mark;
        return {
          status: 1,
          title: ansQuiz?.title,
          expectedTitle: mainAns?.title,
        };
      }

      const status = mainAns.id === answer ? 1 : 2;
      if (status === 1) obtainMark += mainAns.mark;
      mark += mainAns.mark;

      return {
        status,
        title: ansQuiz?.title,
        expectedTitle: mainAns?.title,
      };
    });

    return {
      quiz_items: validate,
      mark,
      obtainMark,
      review: {
        correctText: correctTexts.join("  •  "),
        correctTexts,
        correctWords,
      },
    };
  }

  if (type === "missing_word") {
    const allWord = mainQuiz.filter((ele: any) => ele.type === "word");
    const answers = userAnswers.slice(); // Clone userAnswers to avoid modifying the original

    const validate = mainQuiz.map((quiz: any) => {
      if (quiz.type === "word") {
        const answer = answers[0]; // Get the first answer
        if (answer) {
          const ansWord = mainQuiz.find((w: any) => w.id === answer);
          const currWord = allWord[0]; // Slot (correct word) in sentence order
          const isRight = currWord?.id === answer;
          // Slot's mark, not the tile type (a blank may hold a wrong_word token)
          const slotMark = currWord?.mark ?? 0;

          if (isRight) {
            obtainMark += slotMark;
            mark += slotMark;
          }

          allWord.splice(0, 1);
          answers.splice(0, 1);

          return {
            id: quiz.id,
            // Always the blank's type from `raw` so review UI / answer key stay consistent
            type: quiz.type,
            title: ansWord?.title,
            expectedTitle: currWord?.title,
            status: isRight ? 1 : 0,
          };
        } else {
          // If no answer is available at all
          return {
            id: quiz.id,
            status: 2,
            type: quiz.type,
            expectedTitle: allWord[0]?.title,
          };
        }
      } else if (quiz.type === "wrong_word") {
        const answerIndex = answers.indexOf(quiz.id);

        if (answerIndex !== -1) {
          // If the word is in the user's answers but incorrect
          answers.splice(answerIndex, 1); // Remove the processed wrong_word
          return {
            type: quiz.type,
            title: quiz.title,
            status: 0, // Mark as incorrect
          };
        } else {
          // No user answer for this wrong_word
          return {
            type: quiz.type,
            title: quiz.title,
          };
        }
      } else {
        return {
          type: quiz.type,
          title: quiz.title,
        };
      }
    });

    return { quiz_items: validate, mark, obtainMark };
  }

  if (type === "highlight_word") {
    const allWord = mainQuiz.filter((ele: any) => ele.type === "word");
    const answers = [...userAnswers];
    let obtainMark = 0;
    const total_mark = mainQuiz.reduce(
      (acc: number, quiz: any) => acc + (quiz.type === "word" ? quiz.mark : 0),
      0
    );

    const validate = mainQuiz.map((quiz: any) => {
      if (quiz.type === "word") {
        const currWord = allWord.shift();

        const answer = answers.find((ans) => ans === currWord.id);

        if (answer) {
          const isRight = currWord?.id === answer;
          if (isRight) obtainMark += currWord.mark;

          answers.splice(answers.indexOf(answer), 1);

          return {
            type: currWord.type,
            title: currWord.title,
            expectedTitle: currWord?.title,
            status: isRight ? 1 : 0,
          };
        } else {
          return {
            status: 0,
            type: quiz.type,
            title: currWord?.title,
            expectedTitle: currWord?.title,
          };
        }
      } else {
        const isInAnswers = answers.some((ans) => ans === quiz.id);

        if (isInAnswers) {
          // If the word is in the user's answers but incorrect
          return {
            type: quiz.type,
            title: quiz.title,
            status: 0, // Mark as incorrect
          };
        }

        // else
        return {
          type: quiz.type,
          title: quiz.title,
          // no status if not in array of answers
        };
      }
    });

    return { quiz_items: validate, mark: total_mark, obtainMark };
  }

  if (type === "blank_space") {
    const allWord = mainQuiz.filter((ele: any) => ele.type === "word");
    const answers = userAnswers;
    const validate = mainQuiz.map((quiz: any, idx: number) => {
      if (quiz.type === "word") {
        const answer = answers[0];

        if (answer) {
          const currWord = allWord[0];
          const isRight = currWord?.title?.some(
            (titlePart: any) => titlePart === answer
          );
          if (isRight) obtainMark += currWord?.mark;
          mark += currWord?.mark;
          allWord.splice(0, 1);
          answers.splice(0, 1);
          const exp =
            Array.isArray(currWord?.title) && currWord.title.length
              ? currWord.title.join(" / ")
              : String(currWord?.title ?? "");
          return {
            type: currWord.type,
            title: currWord.title,
            expectedTitle: exp,
            status: isRight ? 1 : 0,
          };
        } else {
          return { status: 2, type: quiz.type, mark, obtainMark };
        }
      } else {
        return {
          type: quiz.type,
          title: quiz.title,
          mark,
          obtainMark,
        };
      }
    });

    return { quiz_items: validate, mark, obtainMark };
  }
  if (type === "blank_space1") {
    const allWordQuizzes = mainQuiz.filter((ele: any) => ele.type === "word");
    const textQuizzes = mainQuiz.filter((ele: any) => ele.type === "text");
    let answers = userAnswers || [];
    let mark = 0;
    let obtainMark = 0;

    const validate = mainQuiz.map((quiz: any, idx: number) => {
      if (quiz.type === "word") {
        const answer = answers[0];
        if (answer) {
          const matchingWord = allWordQuizzes.find(
            (wordQuiz: any) => wordQuiz.title === answer
          );
          const correctAnswer = matchingWord ? matchingWord.title : [];

          mark += matchingWord ? matchingWord.mark : 0;
          if (correctAnswer.includes(answer)) {
            obtainMark += matchingWord ? matchingWord.mark : 0;
          }

          answers.splice(0, 1);

          return {
            type: "word",
            title: correctAnswer,
            status: correctAnswer.includes(answer) ? 1 : 0,
          };
        } else {
          return { type: "word", title: [], status: 2 };
        }
      } else if (quiz.type === "text") {
        const answer = answers[0];
        const isCorrect = quiz.id === answer;

        mark += quiz.mark || 0;
        if (isCorrect) {
          obtainMark += quiz.mark || 0;
        }

        answers.splice(0, 1);

        return {
          type: "text",
          title: quiz.title,
          status: isCorrect ? 1 : 0,
        };
      } else {
        return {
          type: quiz.type,
          title: quiz.title,
        };
      }
    });

    return {
      quiz_items: validate,
      mark: mark || 0,
      obtainMark: obtainMark || 0,
    };
  }

  if (type === "line_connect") {
    const validate = userAnswers.map((answer: any) => {
      //const userAnswer = userAnswers.find((ele: any) => ele.id === quiz.id);
      const quiz = mainQuiz.find((ele: any) => ele.id === answer.id);

      if (!quiz) return { status: 2 };

      const isRight = quiz.ans_id === answer.ans_id;

      const status = isRight ? 1 : 0;

      const userAnswer = isRight
        ? quiz.answer
        : mainQuiz.find((ele: any) => ele.ans_id === answer.ans_id).answer;

      if (status === 1) obtainMark += quiz.mark;
      mark += quiz.mark;

      return {
        title: quiz.title,
        expectedMatch: quiz.answer,
        answer: userAnswer,
        status,
      };
    });
    return { quiz_items: validate, mark, obtainMark };
  }

  if (type === "consonant_blend") {
    const validate = mainQuiz.map((quiz: any) => {
      const isAnswer = userAnswers.find((ele: any) => ele.id === quiz.id);
      mark += quiz.mark;
      if (!isAnswer) {
        return {
          stem: quiz.stem,
          full: quiz.full,
          correctBlend: quiz.blend,
          status: 2,
        };
      }
      const status = isAnswer.answer === quiz.blend ? 1 : 0;
      if (status) obtainMark += quiz.mark;
      return {
        stem: quiz.stem,
        full: quiz.full,
        correctBlend: quiz.blend,
        status,
        selected: isAnswer.answer,
      };
    });
    return { quiz_items: validate, mark, obtainMark };
  }

  if (type == "multiple_choice" || type == "multiple_choice2") {
    const correctOptionTitles = mainQuiz
      .filter((q: any) => q.answer === true)
      .map((q: any) => q.title);
    const validate = mainQuiz.map((quiz: any) => {
      const isAnswer = userAnswers.find((ele: any) => ele.id === quiz.id);

      mark += quiz.mark;

      if (!isAnswer) {
        return {
          title: quiz.title,
          status: 0,
          isCorrectOption: !!quiz.answer,
        };
      }

      const status = quiz.answer === isAnswer.answer ? 1 : 2;
      if (status) obtainMark += quiz.mark;

      return {
        title: quiz.title,
        status,
        answer: isAnswer?.answer,
        isCorrectOption: !!quiz.answer,
      };
    });
    return {
      quiz_items: validate,
      mark,
      obtainMark,
      review: { correctOptionsText: correctOptionTitles.join(" · ") },
    };
  }
  if (["math", "true_false"].includes(type)) {
    const validate = mainQuiz.map((quiz: any) => {
      const isAnswer = userAnswers.find((ele: any) => ele.id === quiz.id);
      mark += quiz.mark;
      if (!isAnswer) {
        return {
          title: quiz.title,
          status: 2,
          correctValue: quiz.answer,
        };
      }

      const status = quiz.answer === isAnswer.answer ? 1 : 0;
      if (status) obtainMark += quiz.mark;

      return {
        title: quiz.title,
        status,
        answer: isAnswer?.answer,
        correctValue: quiz.answer,
      };
    });
    return { quiz_items: validate, mark, obtainMark };
  }
  return { quiz_items: [], mark: 0, obtainMark: 0 };
};

export default quizValidator;
