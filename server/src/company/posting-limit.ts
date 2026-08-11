export const isMajorPostingLimitReached = (
    postedMajors: string[],
    targetMajor: string,
    maximum: number,
) =>
    postedMajors.filter(
        (major) => major.toLowerCase() === targetMajor.toLowerCase(),
    ).length >= maximum;
