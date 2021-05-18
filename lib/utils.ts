export function isFilteredSession({underFortyFive, aboveFortyFive, session, isCovaxin, isCovisheild, isSputnikV}) {
    if (!underFortyFive || !aboveFortyFive) {
        if (underFortyFive && session.min_age_limit !== 18) return false;
        if (aboveFortyFive && session.min_age_limit !== 45) return false;
    }

    if (!isCovaxin || !isCovisheild || !isSputnikV) {
        if (isCovaxin && isCovisheild) {
            if (!(session.vaccine === "COVISHIELD" || session.vaccine === "COVAXIN")) return false;
        } else if (isCovaxin && isSputnikV) {
            if (!(session.vaccine === "SPUTNIKV" || session.vaccine === "COVAXIN")) return false;
        } else if (isCovisheild && isSputnikV) {
            if (!(session.vaccine === "SPUTNIKV" || session.vaccine === "COVISHIELD")) return false;
        } else if (isCovaxin && session.vaccine !== "COVAXIN") return false;
        else if (isCovisheild && session.vaccine !== "COVISHIELD") return false;
        else if (isSputnikV && session.vaccine !== "SPUTNIKV") return false;
    }

    return true;
}

export function isFilteredCenter({isPaid, center, isFree}) {
    if (!isPaid || !isFree) {
        if (isPaid && center.fee_type !== "Paid") return false;
        if (isFree && center.fee_type !== "Free") return false;
    }
    return true;
}
