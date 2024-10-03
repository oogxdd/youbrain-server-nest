// This is for the Deepgram Nova2

export function extractParagraphsFromTranscript(transcriptData) {
  const { utterances, lineBreaks } = transcriptData;

  let paragraphs = [];
  let currentParagraph = {
    start: 0,
    end: 0,
    text: '',
    speaker: null,
  };
  let lastBreakTime = 0;

  utterances.forEach((utterance) => {
    utterance.words.forEach((word) => {
      // If this is the first word in the paragraph, set the start time and speaker
      if (currentParagraph.text === '') {
        currentParagraph.start = word.start;
        currentParagraph.speaker = utterance.speaker;
      }

      // Check if there's a line break between the last break and this word
      const nextLineBreak = lineBreaks.find(
        (breakTime) => breakTime > lastBreakTime && breakTime <= word.end,
      );

      if (nextLineBreak) {
        // If there's a line break, end the current paragraph and start a new one
        if (currentParagraph.text) {
          currentParagraph.end = word.end;
          paragraphs.push({ ...currentParagraph });
          currentParagraph = {
            start: word.end,
            end: 0,
            text: '',
            speaker: utterance.speaker,
          };
        }
        lastBreakTime = nextLineBreak;
      }

      // Add the word to the current paragraph
      currentParagraph.text += word.punctuated_word + ' ';
      currentParagraph.end = word.end;
    });
  });

  // Add the last paragraph if it's not empty
  if (currentParagraph.text) {
    paragraphs.push({ ...currentParagraph });
  }

  return paragraphs;
}
