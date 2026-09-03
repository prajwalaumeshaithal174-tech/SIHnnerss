import json
import os

# ---------------------------------------------------------
# EXPLICIT ASSUMPTION FOR MORATORIUM
# ---------------------------------------------------------
# The SIH statement specifies tenure and moratorium length, but 
# does not define whether interest during moratorium is capitalized 
# or paid as simple interest. 
# ASSUMPTION: Interest accrued during the moratorium is 
# capitalized (added to principal) before EMI calculation begins.
MORATORIUM_INTEREST_TREATMENT = "capitalized"
# ---------------------------------------------------------

# SIH Official Scheme Rules
SCHEMES = {
    "micro_finance": {
        "name": "Micro Finance Scheme",
        "max_project_cost": 140000,
        "max_loan": 125000,
        "interest_rate": 0.065, # 6.5%
        "tenure_years": 3,
        "moratorium_months": 3
    },
    "term_loan": {
        "name": "Term Loan Scheme",
        "min_project_cost": 140000, # exclusive
        "max_project_cost": 5000000, # inclusive
        "max_loan": 4500000,
        "interest_rate": 0.08, # 8%
        "tenure_years": 7,
        "moratorium_months": 6
    }
}

def load_profile(business_category):
    file_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "data",
        f"{business_category.lower()}_profile.json"
    )
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Profile for '{business_category}' not found at {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def validate_profile(profile):
    validation_results = []
    
    if profile.get("fixedCapital", {}).get("total") is not None:
        # Check Fixed Capital
        fc = profile.get("fixedCapital", {})
        fc_calculated = sum([v for k, v in fc.items() if k != "total" and isinstance(v, (int, float))])
        fc_reported = fc.get("total", 0)
        validation_results.append({
            "component": "Fixed Capital",
            "reported": fc_reported,
            "calculated": fc_calculated,
            "difference": fc_reported - fc_calculated,
            "is_consistent": fc_reported == fc_calculated
        })
        
        # Check Working Capital
        op = profile.get("operatingExpenses", {})
        wc = profile.get("workingCapital", {})
        rm_months = wc.get("method", {}).get("rawMaterialMonths", 0)
        other_months = wc.get("method", {}).get("otherExpenseMonths", 0)
        
        rm_cost = op.get("monthlyRawMaterials", 0) * rm_months
        other_cost = (op.get("monthlyWages", 0) + op.get("monthlyUtilitiesOther", 0)) * other_months
        
        wc_calculated = rm_cost + other_cost
        wc_reported = wc.get("amount", 0)
        validation_results.append({
            "component": "Working Capital",
            "reported": wc_reported,
            "calculated": wc_calculated,
            "difference": wc_reported - wc_calculated,
            "is_consistent": wc_reported == wc_calculated
        })
        
        # Check Total Project Cost
        pc_reported = profile.get("projectCost", {}).get("total", 0)
        pc_calculated = fc_reported + wc_reported
        validation_results.append({
            "component": "Project Cost",
            "reported": pc_reported,
            "calculated": pc_calculated,
            "difference": pc_reported - pc_calculated,
            "is_consistent": pc_reported == pc_calculated
        })
        
    return validation_results

def calculate_financials(own_capital, business_category, location="Shikaripur, Shivamogga district, Karnataka."):
    # 0. Normalization
    if isinstance(business_category, str):
        business_category = business_category.strip().lower()
    
    # 1. Input Validation
    errors = []
    if not isinstance(own_capital, (int, float)):
        errors.append({"field": "ownCapital", "message": "own_capital must be numeric."})
    elif own_capital < 0:
        errors.append({"field": "ownCapital", "message": "own_capital must be >= 0."})
        
    if not isinstance(business_category, str) or business_category not in ["agriculture", "furniture"]:
        errors.append({"field": "businessCategory", "message": "business_category must be 'agriculture' or 'furniture'."})
        
    if errors:
        return {
            "success": False,
            "errors": errors
        }
        
    profile = load_profile(business_category)
    
    # 2. Profile Validation
    validation_results = validate_profile(profile)
    
    # 3. Reference Project Data (strictly kept separate from SIH calculation)
    ref_fixed_capital = profile.get("fixedCapital", {}).get("total")
    ref_working_capital = profile.get("workingCapital", {}).get("amount")
    ref_project_cost = profile.get("projectCost", {}).get("total")
    
    # 4. Working Capital Detail (Reference)
    op = profile.get("operatingExpenses", {})
    wc = profile.get("workingCapital", {})
    rm_months = wc.get("method", {}).get("rawMaterialMonths")
    other_months = wc.get("method", {}).get("otherExpenseMonths")
    
    calc_basis = None
    if rm_months is not None and other_months is not None:
        calc_basis = f"{rm_months} months raw materials + {other_months} month work expenses"
    
    # 5. SIH Official Financial Structuring
    # Rules: Available Margin Capital = 10% of Project Cost
    margin_percentage = 0.10
    loan_percentage = 0.90
    
    feasible_project_cost = own_capital / margin_percentage
    maximum_loan = feasible_project_cost * loan_percentage
    
    # 6. Scheme Selection
    scheme = None
    scheme_name = None
    if feasible_project_cost <= SCHEMES["micro_finance"]["max_project_cost"]:
        scheme = SCHEMES["micro_finance"]
    elif feasible_project_cost > SCHEMES["term_loan"]["min_project_cost"] and feasible_project_cost <= SCHEMES["term_loan"]["max_project_cost"]:
        scheme = SCHEMES["term_loan"]
        
    scheme_output = {
        "configured": False,
        "name": None,
        "eligible": False,
        "eligibleProjectCost": feasible_project_cost,
        "eligibleLoan": None,
        "margin": f"{margin_percentage*100}%",
        "interestRate": None,
        "tenure": None,
        "moratorium": None
    }
    
    repayment_output = {
        "emi": None,
        "totalInterest": None,
        "totalRepayment": None,
        "moratorium": None
    }

    if scheme:
        scheme_output["configured"] = True
        scheme_output["name"] = scheme["name"]
        scheme_output["eligible"] = True
        
        eligible_loan = min(maximum_loan, scheme["max_loan"])
        scheme_output["eligibleLoan"] = round(eligible_loan, 2)
        scheme_output["interestRate"] = f"{scheme['interest_rate']*100}%"
        scheme_output["tenure"] = f"{scheme['tenure_years']} years"
        scheme_output["moratorium"] = f"{scheme['moratorium_months']} months"
        
        # EMI Calculation
        # Tenure INCLUDES moratorium. Repayment months = (tenure * 12) - moratorium
        total_months = scheme["tenure_years"] * 12
        repayment_months = total_months - scheme["moratorium_months"]
        monthly_rate = scheme["interest_rate"] / 12.0
        
        if MORATORIUM_INTEREST_TREATMENT == "capitalized":
            # Simple assumption: Interest accrues and is added to principal
            interest_during_moratorium = eligible_loan * monthly_rate * scheme["moratorium_months"]
            principal_at_repayment_start = eligible_loan + interest_during_moratorium
            
            repayment_output["moratorium"] = {
                "treatment": MORATORIUM_INTEREST_TREATMENT,
                "interestAccrued": round(interest_during_moratorium, 2),
                "principalAfterMoratorium": round(principal_at_repayment_start, 2)
            }
            
            # Standard EMI formula on new principal
            if repayment_months > 0:
                r = monthly_rate
                n = repayment_months
                emi = principal_at_repayment_start * r * ((1 + r) ** n) / (((1 + r) ** n) - 1)
                
                total_repayment = emi * n
                total_interest = total_repayment - eligible_loan # Total interest paid over life of loan
                
                repayment_output["emi"] = round(emi, 2)
                repayment_output["totalRepayment"] = round(total_repayment, 2)
                repayment_output["totalInterest"] = round(total_interest, 2)
            else:
                repayment_output["emi"] = 0
                repayment_output["totalRepayment"] = principal_at_repayment_start
                repayment_output["totalInterest"] = interest_during_moratorium

    return {
        "success": True,
        "businessCategory": profile.get("category"),
        "location": location,
        "userInput": {
            "ownCapital": own_capital
        },
        "referenceProject": {
            "fixedCapital": ref_fixed_capital,
            "workingCapital": ref_working_capital,
            "totalProjectCost": ref_project_cost
        },
        "financialStructuring": {
            "availableMarginCapital": own_capital,
            "marginPercentage": f"{margin_percentage*100}%",
            "feasibleProjectCost": round(feasible_project_cost, 2),
            "loanPercentage": f"{loan_percentage*100}%",
            "maximumLoan": round(maximum_loan, 2)
        },
        "workingCapital": {
            "monthlyRawMaterials": op.get("monthlyRawMaterials"),
            "monthlyWages": op.get("monthlyWages"),
            "monthlyUtilitiesOther": op.get("monthlyUtilitiesOther"),
            "monthlyOperatingExpense": op.get("monthlyTotal"),
            "workingCapitalRequirement": wc.get("amount"),
            "calculationBasis": calc_basis
        },
        "scheme": scheme_output,
        "repayment": repayment_output,
        "validation": validation_results
    }

if __name__ == "__main__":
    def print_test(name, result):
        print(f"--- {name} ---")
        print(json.dumps(result, indent=2))
        print("\n")
        
    print_test("TEST A: Agriculture + Rs. 10,000", calculate_financials(10000, "agriculture"))
    print_test("TEST B: Agriculture + Rs. 14,000", calculate_financials(14000, "agriculture"))
    print_test("TEST C: Agriculture + Rs. 15,000", calculate_financials(15000, "agriculture"))
    print_test("TEST D: Agriculture + Rs. 1,00,000", calculate_financials(100000, "agriculture"))
    print_test("TEST E: Agriculture + Rs. 5,00,000", calculate_financials(500000, "agriculture"))
    print_test("TEST F: Agriculture + Rs. 5,00,001", calculate_financials(500001, "agriculture"))
    print_test("TEST G: Agriculture + Rs. 3,30,000", calculate_financials(330000, "agriculture"))
    print_test("TEST H: Furniture + Rs. 1,00,000", calculate_financials(100000, "furniture"))
