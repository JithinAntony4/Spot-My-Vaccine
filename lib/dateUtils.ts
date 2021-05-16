export function getCurrentFormattedDate() {
    try {
        let date = new Date();
        let dateEle = date.toISOString().split('T')[0];
        let reverse = dateEle.split('-').reverse();
        return reverse.join('-');
    } catch (e) {
        console.log(e.message);
        return ""
    }
}

export function reverseFormattedDate(dateEle) {
    try {
        let reverse = dateEle.split('-').reverse();
        return new Date(reverse.join('-'));
    } catch (e) {
        console.log(e.message);
        return ""
    }
}
