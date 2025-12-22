// export default function CompareText(a,b){  
//     const e=String(a).toLowerCase().split(" ");
//     const s=String(b).toLowerCase().split(" ");
//     console.log(e);
//     console.log(s);
//     let match=0;
//     for(let i=0;i<e.length;i++){
//         if(e[i]==s[i]){
//             match++;
//         }
//     }
//     return {
//         match,
//         length:e.length
//     }
// }


function levenshtein(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();

    const matrix = [];

    
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

   
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const cost = a[j - 1] === b[i - 1] ? 0 : 1;

            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      
                matrix[i][j - 1] + 1,      
                matrix[i - 1][j - 1] + cost 
            );
        }
    }

    return matrix[b.length][a.length];
}



function wordSimilarity(target, spoken) {
    const dist = levenshtein(target, spoken);
    const maxLen = Math.max(target.length, spoken.length);

    if (maxLen === 0) return 0;

    return Math.round(((maxLen - dist) / maxLen) * 100);
}




function CompareText(targetSentence, spokenSentence) {
    console.log(targetSentence);
    console.log(spokenSentence);
    const targetWords = targetSentence.toLowerCase().trim().split(/\s+/);
    const spokenWords = spokenSentence.toLowerCase().trim().split(/\s+/);

    const used = new Set(); 

    const scores = targetWords.map(target => {
        let bestMatch = "";
        let bestScore = 0;
        let bestIndex = -1;

        spokenWords.forEach((spoken, i) => {
            if (used.has(i)) return; 

            const similarity = wordSimilarity(target, spoken);

            
            if (similarity > bestScore && similarity >= 50) {
                bestScore = similarity;
                bestMatch = spoken;
                bestIndex = i;
            }
        });

        
        if (bestIndex !== -1) {
            used.add(bestIndex);
            return {
                target,
                spoken: bestMatch,
                score: bestScore,
                missing: false
            };
        }

       
        return {
            target,
            spoken: "",
            score: 0,
            missing: true
        };
    });

    return scores;
}


export default CompareText;
