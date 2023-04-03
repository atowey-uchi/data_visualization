library(dplyr)
library(tidyr)
df <- read_csv("Downloads/GSS (1).xlsx - Sheet2.csv")

df <- df %>% 
  mutate(income_group = case_when(
    income == "$25,000 or more" ~ "$25,000 or more",
    income %in% c("Under $1,000", "$1,000 to $2,999", "$3,000 to $3,999") ~ "Low income",
    TRUE ~ "Middle income"
  ))

df$age_group <- cut(df$age, breaks = c(18, 30, 45, 60), right = FALSE, labels = c("18-29", "30-44", "45-59"))
df$age_group
df_std <- df %>%
  group_by(income_group) %>%
  mutate(happy_num_std = (happy_num - mean(happy_num)) / sd(happy_num))
df_std

df_avg <- df %>%
  group_by(sex, race, age_group, year, is_parent) %>%
  summarise(avg_happy_num = mean(happy_num, na.rm = TRUE))
df_avg

df_diff <- df_avg %>%
  group_by(sex, race, age_group, is_parent) %>%
  summarize(diff_2018_2021 = avg_happy_num[year == 2021] - avg_happy_num[year == 2018])

write.csv(df_diff, "my_data.csv", row.names = FALSE)

###

df_avg <- df_std %>%
  group_by(sex, race, age_group, year, is_parent) %>%
  summarise(avg_happy_num = mean(happy_num, na.rm = TRUE))
df_avg

df_diff <- df_avg %>%
  group_by(sex, race, age_group, is_parent) %>%
  summarize(diff_2018_2021 = avg_happy_num[year == 2021] - avg_happy_num[year == 2018])

write.csv(df_diff, "my_data.csv", row.names = FALSE)


