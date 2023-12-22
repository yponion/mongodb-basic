const addSum = (a, b, callback) => {
    setTimeout(() => {
        if (typeof a !== 'number' || typeof b !== 'number') {
            return callback('a, b must be numbers')
        }
        callback(undefined, a + b)
    }, 3000)
}

addSum(10, 20, (error, sum) => {
    if (error) return console.log({error});
    console.log({sum})
    addSum(sum, 15, (error, sum) => { // 스코스 오버라이딩 밑에 error, sum은 여기 error sum임.
        if (error) return console.log({error});
        console.log({sum})
    })
})