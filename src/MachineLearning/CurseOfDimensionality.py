import random
from matplotlib import pyplot as plt
from mpl_toolkits import mplot3d

points = 100
x = [random.random() for _ in range(points)]
y = [random.random() for _ in range(points)]
z = [random.random() for _ in range(points)]

# 2d
#plt.scatter(x, y, c='red')

# 3d
ax = plt.axes(projection='3d')
ax.scatter(x, y, z, c='red')

plt.savefig("test.svg", format="svg")
