from models.sentiment_analysis import serverSentiment
import sys

input = sys.stdin.read()


# RIGHT NOW SENDING DATA BACK AND FORTH IS SLOW!!!!
# FIND A WAY TO OPTIMIZE THIS!!!!!!


# determine which function to call. add a param ti determine the command.
# call the functions and then just return the result

output = input
print(1)
#print(output.input)

sys.stdout.flush()