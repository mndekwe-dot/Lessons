# 3.3 Investment growth: deposit grows by rate% each year. Years until threshold? (100, 20, 150) -> 3
def find(deposit, rate, threshold):
    years = 0
    balance  = deposit
    while balance < threshold:
        balance += balance *(rate / 100)
        years +=1
    return years
result= find(100,20,150)
print(result)