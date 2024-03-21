// https://stackoverflow.com/a/73634247
export function isEmojiOnly(str: string) {
  const stringToTest = str.trim().replaceAll(' ', '')
  const emojiRegex =
    /^(?:(?:\p{RI}\p{RI}|\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u{200D}\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*)|[\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])+$/u
  return emojiRegex.test(stringToTest) && Number.isNaN(Number(stringToTest))
}
