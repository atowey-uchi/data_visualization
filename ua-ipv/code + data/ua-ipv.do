//Frequency of types of violence by how much partner drinks 
// Women's responses only

// Using Ukraine 2007 DHS Data (Individual Recode)
use "C:\Users\atowey\OneDrive - The University of Chicago\Downloads\UA_2007_DHS_03022023_024_188135\UAIR51DT\UAIR51FL.DTA", clear

// Generate domestic violence module weight d005 (not v005)
gen wgt = d005/1000000

keep if v502 != 0
keep if v044==1
keep if d104 != 9
keep if d106 != 9
keep if d107 != 9
keep if d108 != 9

// Keep if partner's drinking amount is recorded in the data
keep if d114 == 0 | d114 == 1 | d114 == 2


// Generate variable for all physical violence
// Combine severe physical with less severe physical violence
gen anyphys = (d106 ==1) | (d107==1)

// Generate variable for emotional violence
gen emo = d104==1

// Generate variable for sexual violence
gen sexual = d108==1


// Generate variables for each type of violence ONLY
gen sexual_only = (emo==0)&(sexual==1)&(anyphys==0)
gen physical_only = (emo==0)&(sexual==0)&(anyphys==1)
gen emotional_only = (emo==1)&(sexual==0)&(anyphys==0)
gen none = (emo!=1)&(sexual!=1)&(anyphys!=1)
tab none [iw=wgt]
tab none

// Generate variable for if woman experiences all three types of violence
gen all_types = (emo==1)&(sexual==1)&(anyphys==1)

// Generate variables for combinations of types of violence
gen phys_sex = (emo==0)&(sexual==1)&(anyphys==1)
gen phys_emo = (emo==1)&(sexual==0)&(anyphys==1)
gen sex_emo = (emo==1)&(sexual==1)&(anyphys==0)

// Tabulate findings
foreach var of varlist all_types phys_sex phys_emo sex_emo physical_only sexual_only emotional_only {
    tabulate d114 `var' [iweight=wgt]

