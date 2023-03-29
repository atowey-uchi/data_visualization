# Currently-Married Ukrainian Women's Experiences of Intimate Partner Violence Given How Often Husband Drinks, 2007

*Data and Vizualization Code*

Allison Towey, University of Chicago, March 2023

## Visualization:
![Ukraine IPV Data Visualization](https://user-images.githubusercontent.com/89881145/228403970-84d2b5db-0993-48c5-abb9-edfc30939e39.png)

## Full Text:

Intimate Partner Violence (IPV) is a matter of great concern across the globe, especially in Ukraine, where a fourth of ever-married women report having ever experienced some type of emotional, physical, or sexual violence perpetrated by a partner or husband. Additionally, Ukraine is characterized by elevated levels of alcohol use and alcoholism in comparison to other European countries, particularly among men (Bromet et al. 2005). This is particularly concerning given that men’s alcohol use has been identified as the strongest risk factor associated with IPV perpetration in Ukraine and across former Soviet states (Barrett et al. 2012, Ismayilova 2015).

This figure leverages data from the most recent Demographic and Health Survey fielded in Ukraine;  effectively, I summarize the experiences of currently-married Ukrainian women in 2007 according to their husbands’ levels of  alcohol consumption. The measure of violence distinguishes women’s cumulative experience of physical, sexual, and emotional intimate partner violence.

The matrix chart is partitioned according to women’s reports of their husbands’ drinking habits: “never, sometimes, or often.” Each square in the visualization relates to 0.1% of the total weighted sample of currently-married Ukrainian women, for a total of 1000 squares. Within each group, the proportion of women who report intimate partner violence are denoted by the color of the square: those experiencing physical violence are denoted in yellow, emotional violence in blue, and sexual violence in red. Because women can and do experience multiple types of IPV, combinations of violence are represented by multi-colored squares. 

Overall, this allows viewers to 1) compare frequencies of how often women report their husbands drink, 2) compare frequencies of the forms of IPV women experience, and, importantly, 3) analyze the proportion of women experiencing IPV in each alcohol consumption group. For women with abstemious husbands, 7% report experiencing at least one form of IPV, with none of these women reporting sexual violence. Among women whose husbands sometimes drink, nearly a fourth (24.5%) experience some form of violence. Nearly three-fourths (72.6%) of women whose husbands often drink experience some form of IPV. In fact, of all women who experience any violence, over a third (36.2%) of them have husbands who drink often, despite the ‘often’ group only making up 13% of women. The most prevalent form of violence is emotional violence (24.9%), followed by physical (15.3%), and sexual (3.7%) violence.

Confirming the strong relationship between frequent alcohol consumption and intimate partner violence suggested by previous epidemiological studies (Foran and O’Leary 2008), this visualization underscores the prevalence of IPV in Ukraine and the role of alcohol as a risk factor in intimate partnerships. The current conditions of conflict in Ukraine has disrupted daily life, including the collection of health and familial relationships data. Research from other conflict settings suggests that the stress of armed conflict exacerbates IPV, among other social problems (Annan and Brier, 2010). As the consequences of war are cataloged and examined by scholars and humanitarian workers, updating our knowledge about the experiences of families should be counted among the many urgent questions that need to be answered. 

### References:

1. Annan, J., & Brier, M. (2010). The risk of return: intimate partner violence in Northern Uganda's armed conflict. Social science & medicine, 70(1), 152-159.

2. Barrett BJ, Habibov N, Chernyak E. Factors affecting prevalence and extent of intimate partner violence in Ukraine: evidence from a nationally representative survey. Violence Against Women. 2012;18(10):1147–1176

3. Bromet, EJ., et al. Epidemiology of psychiatric and alcohol disorders in Ukraine. Social psychiatry and psychiatric epidemiology 40.9 (2005): 681-690.

4. Foran HM, O'Leary KD. Alcohol and intimate partner violence: a meta-analytic review. Clin Psychol Rev. 2008 Oct;28(7):1222-34. 

5. Ismayilova, L. Spousal violence in 5 transitional countries: a population-based multilevel analysis of individual and contextual factors. American Journal of Public Health 105.11 (2015): e12-e22.

## Replication Code (STATA)

## Data (CSV)
https://github.com/atowey-uchi/data_visualization/blob/main/ua-ipv/ua-ipv%20data.csv

## Code to Crete Visualization (HTML)
https://github.com/atowey-uchi/data_visualization/blob/main/ua-ipv/ua-ipv.html

