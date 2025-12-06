// This a placeholder header presenter, used for testing and debugging
/*import { HeaderView } from "../views/headerView.jsx";

export function HeaderPresenter() {   
    return (
        <HeaderView
            onNavigateHome={() => window.location.href = "/"}
            onProfile={() => window.location.href = "/"}
        />
    );
}*/


/***********************************************************************
 * HeaderPresenter.jsx
 *
 * Responsibilities:
 *  - Connect HeaderView to Redux
 *  - Pass current search query and selected filters as props
 *  - Dispatch fetchSearch when user searches
 *  - Dispatch filter selection actions
 ***********************************************************************/

import { connect } from "react-redux";
import { HeaderView } from "../views/headerView.jsx";
import { fetchSearch } from "../redux/slices/animeSlice.js";

// Optional: store filters in Redux (could be part of a searchSlice)
import { setSelectedType, setSelectedStatus, setSelectedRating, setSelectedGenres, setSelectedOrderBy } from "../redux/slices/animeSlice.js";

function mapStateToProps(state) {
  const searchFilters = state.anime.searchFilters || {};
  return {
    query: searchFilters.query || "",
    selectedType: searchFilters.selectedType || "",
    selectedStatus: searchFilters.selectedStatus || "",
    selectedRating: searchFilters.selectedRating || "",
    selectedGenres: searchFilters.selectedGenres || [],
    selectedOrderBy: searchFilters.selectedOrderBy || "",
    typeOptions: searchFilters.typeOptions || ["TV", "Movie", "OVA"],
    statusOptions: searchFilters.statusOptions || ["Airing", "Completed", "Upcoming"],
    ratingOptions: searchFilters.ratingOptions || ["G", "PG", "PG-13", "R", "R+"],
    orderByOptions: searchFilters.orderByOptions || ["Title", "Score", "Popularity"],
    genreOptions: state.anime.genres.promiseState.data || []
  };
}


const mapDispatchToProps = (dispatch) => ({
  onQueryChange: (query) => dispatch({ type: "anime/setQuery", payload: query }),
  onSearch: (query) => dispatch(fetchSearch(query)),
  onTypeChange: (value) => dispatch(setSelectedType(value)),
  onStatusChange: (value) => dispatch(setSelectedStatus(value)),
  onRatingChange: (value) => dispatch(setSelectedRating(value)),
  onGenresChange: (selected) => dispatch(setSelectedGenres(selected)),
  onOrderByChange: (value) => dispatch(setSelectedOrderBy(value)),
});

export const HeaderPresenter = connect(mapStateToProps, mapDispatchToProps)(HeaderView);
