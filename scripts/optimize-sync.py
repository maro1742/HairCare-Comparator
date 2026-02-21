import os
import re
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase credentials missing.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

TABLES = [
    "products_ceneo",
    "products_bielenda",
    "products_natura",
    "products_insight",
    "products_dsd_deluxe"
]

def optimize_data():
    for table_name in TABLES:
        print(f"\nProcessing table: {table_name}...")
        try:
            response = supabase.table(table_name).select("*").execute()
            products = response.data
            print(f"Analyzing {len(products)} products...")
            
            updated_count = 0
            for product in products:
                name = product.get("name", "")
                desc = product.get("description", "")
                combined_text = f"{name} {desc}"

                updated_fields = {}
                
                # Check for PEH if missing
                if not product.get("peh_ratio"):
                    low_text = combined_text.lower()
                    if "protein" in low_text or "keratyn" in low_text:
                        updated_fields["peh_ratio"] = "70,20,10"
                    elif "emolient" in low_text or "olej" in low_text or "masło" in low_text:
                        updated_fields["peh_ratio"] = "10,80,10"
                    elif "humektant" in low_text or "aloes" in low_text or "panthenol" in low_text:
                        updated_fields["peh_ratio"] = "10,20,70"

                if updated_fields:
                    supabase.table(table_name).update(updated_fields).eq("id", product["id"]).execute()
                    updated_count += 1

            if updated_count > 0:
                print(f"Applied {updated_count} updates to {table_name}.")
            else:
                print(f"No updates needed for {table_name}.")
        except Exception as e:
            print(f"Error processing {table_name}: {e}")

if __name__ == "__main__":
    optimize_data()
