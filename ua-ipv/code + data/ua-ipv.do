use "C:\Users\atowey\OneDrive - The University of Chicago\Downloads\UA_2007_DHS_03022023_024_188135\UAIR51DT\UAIR51FL.DTA", clear

// Generate weights
gen wgt = d005/1000000

// Subset our data to if the respondent answered how often their husband drinks (d114)
keep if d114 == 0 | d114 == 1 | d114 == 2

// Grab all physical and combine severe and less severe
gen anyphys = (d107 != 9 & d107 != 0) | (d106 != 9 & d106 != 0)

// Grab emotional
gen emo = d104 == 1

// Grab sexual
gen sexual = d108 == 1

gen sexual_only = (emo == 0) & (sexual == 1) & (anyphys == 0)
gen physical_only = (emo == 0) & (sexual == 0) & (anyphys == 1)
gen emotional_only = (emo == 1) & (sexual == 0) & (anyphys == 0)

// Create combinations
gen all_types = (emo == 1) & (sexual == 1) & (anyphys == 1)
gen phys_sex = (emo == 0) & (sexual == 1) & (anyphys == 1)
gen phys_emo = (emo == 1) & (sexual == 0) & (anyphys == 1)
gen sex_emo = (emo == 1) & (sexual == 1) & (anyphys == 0)

// Tabulate findings
foreach var of varlist all_types phys_sex phys_emo sex_emo physical_only sexual_only emotional_only {
    tabulate d114 `var' [iweight=wgt]
}

