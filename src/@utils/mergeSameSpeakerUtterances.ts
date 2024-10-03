export function mergeSameSpeakerUtterances(utterances) {
  let result = [];
  let currentUtterance = null;

  utterances.forEach((item) => {
    if (!currentUtterance || currentUtterance.speaker !== item.speaker) {
      if (currentUtterance) {
        result.push(currentUtterance);
      }
      currentUtterance = { ...item, words: [...item.words] };
    } else {
      currentUtterance.end = item.end;
      currentUtterance.words = currentUtterance.words.concat(item.words);
      currentUtterance.transcript += ' ' + item.transcript;
    }
  });

  if (currentUtterance) {
    result.push(currentUtterance);
  }

  return result;
}
