def are_similar(a, b):
    """Two lists are 'similar' if they are equal, OR can be made equal by
    swapping exactly ONE pair of elements in ONE of them. (Real GCA problem.)

    [1,2,3] and [1,2,3] -> True
    [1,2,3] and [2,1,3] -> True
    [1,2,2] and [2,1,1] -> False
    """
    diffs =[]
    for i in range(len(a)):
        if a[i] != b[i]:
            diffs.append(i)
    if len(diffs) == 0: 
        return True   
    if len(diffs) == 2:
        i,j = diffs[0],diffs[1]
        return a[i] == b[j] and a[j] == b[i]
    return False
results=are_similar([1,2,3], [2,1,3])
print(results)