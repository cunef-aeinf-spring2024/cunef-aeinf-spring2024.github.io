library(rtweet)
library(tidyverse)

# auth_setup_default()

auth <- rtweet_app()
# auth <- rtweet_bot()

post_tweet(status = "Este tweet ha sido publicado por R")
## your tweet has been posted!


# Now you are ready to search twitter for recent tweets! Let’s start by finding 
# all tweets that use the #rstats hashtag. Notice below you use the rtweet::search_tweets() 
# function to search. search_tweets() requires the following arguments:

# q: the query word that you want to look for
# n: the number of tweets that you want returned. You can request up to a maximum of 18,000 tweets.

musk_tweets <- search_tweets(q = "Russia",
                               n = 500)


musk_tweets %>% select(full_text) %>% slice(1:3)

