def most_frequent(nums):
    """The value that appears most often. [3,1,3,2,3,1] -> 3"""
    ...
    seen = set()
    count={}
    for x in nums:
        count[x] = count.get(x,0)+0 
    best =0
    for i in cou

results=solution([1,2,3], [2,1,3])
print(results)