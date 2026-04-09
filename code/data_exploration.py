import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Load data
df = pd.read_csv("../data/hotel_bookings.csv")

print(df.head())
print(df.info())

# Target distribution
sns.countplot(x='is_canceled', data=df)
plt.title("Cancellation Distribution")
plt.show()

# Hotel type
sns.countplot(x='hotel', hue='is_canceled', data=df)
plt.show()

# Lead time
sns.histplot(data=df, x='lead_time', hue='is_canceled', bins=50)
plt.show()