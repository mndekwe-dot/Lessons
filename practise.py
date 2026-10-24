def find(deposit, rate, threshold):
    years = 0
    balance = deposit

    while balance < threshold:          # '<' so it runs while under the goal
        balance += balance * (rate / 100) # '/' so 20/100 becomes 0.2
        years += 1

    return years

result = find(100, 20, 150)
print(result) # Now prints: 3 ✅