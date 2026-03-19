import { ref } from 'vue'

interface ClearbitResponse {
  name: string
  domain: string
  logo: string
}

// Define the shape of the data we will use in our component
export interface SuggestedCompany {
  name: string
  url: string
  logo: string
}

export function useCompanyAutocomplete() {
  const query = ref('')
  const results = ref<SuggestedCompany[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const debounceDelay = 1000

  // Store the timeout ID for debouncing
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null

  const getBrandfetchLogo = (domain: string): string => {
    return `https://cdn.brandfetch.io/${domain}`
  }

  // Main search function
  const searchCompanies = (searchQuery: string) => {
    query.value = searchQuery

    // Clear previous results if query is too short
    if (searchQuery.length < 2) {
      results.value = []
      return
    }

    // Clear the existing timeout to restart the debounce timer
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    // Wait 1sec after the user stops typing before making the API call
    debounceTimeout = setTimeout(async () => {
      error.value = null
      isLoading.value = true

      try {
        const response = await fetch(
          `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(searchQuery)}`,
        )

        if (!response.ok) {
          throw new Error('Failed to fetch companies')
        }

        const data: ClearbitResponse[] = await response.json()

        results.value = data.map((company) => ({
          name: company.name,
          url: `https://${company.domain}`,
          logo: getBrandfetchLogo(company.domain),
        }))
      } catch (err: unknown) {
        error.value =
          err instanceof Error ? err.message : 'An error occurred while fetching companies.'
        results.value = []
      } finally {
        isLoading.value = false
      }
    }, debounceDelay)
  }

  const clearResults = () => {
    results.value = []
    query.value = ''
  }

  return {
    query,
    results,
    isLoading,
    error,
    searchCompanies,
    clearResults,
  }
}
