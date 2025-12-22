/***********************************************************************
 * Responsibilities:
 *  - Connect HeaderView to Redux
 *  - Pass current search query and selected filters as props
 *  - Dispatch fetchSearch when user searches
 *  - Dispatch filter selection actions
 *  - Integrate TraceMoe image-based anime search
 ***********************************************************************/

import { connect } from "react-redux";
import { HeaderView } from "../views/headerView.jsx";
import { fetchSearch } from "../redux/slices/animeSlice.js";
import { loginUserThunk, logoutUserThunk } from "../redux/thunks/userThunks.js";
import { 
  setQuery, setSelectedType, setSelectedStatus, 
  setSelectedRating, setSelectedGenres, setSelectedOrderBy 
} from "../redux/slices/animeSlice.js";
import { fetchTraceMoeResult, clearTraceMoe } from "../redux/slices/traceMoeSlice.js";

function mapStateToProps(state) {
  const searchFilters = state.anime.searchFilters || {};
  const traceMoeState = state.traceMoe || {};

  return {
    query: searchFilters.query || "",
    selectedType: searchFilters.selectedType || "",
    selectedStatus: searchFilters.selectedStatus || "",
    selectedRating: searchFilters.selectedRating || "",
    selectedGenres: searchFilters.selectedGenres || [],
    selectedOrderBy: searchFilters.selectedOrderBy || "",
    typeOptions: searchFilters.typeOptions,
    statusOptions: searchFilters.statusOptions,
    ratingOptions: searchFilters.ratingOptions,
    orderByOptions: searchFilters.orderByOptions,
    genreOptions: state.anime.allGenres.promiseState.data || [],
    isLoggedIn: !!state.user.uid,

    traceMoe: {
      data: traceMoeState.data,
      error: traceMoeState.promiseState?.error || null,
      loading: !!traceMoeState.promiseState?.promise
    }
  };
}

const mapDispatchToProps = (dispatch) => ({
  onQueryChange: (query) => dispatch(setQuery(query)),
  onSearch: () => dispatch(fetchSearch()),

  onTypeChange: (value) => dispatch(setSelectedType(value)),
  onStatusChange: (value) => dispatch(setSelectedStatus(value)),
  onRatingChange: (value) => dispatch(setSelectedRating(value)),
  onGenresChange: (selected) => dispatch(setSelectedGenres(selected)),
  onOrderByChange: (value) => dispatch(setSelectedOrderBy(value)),

  onLogin: () => dispatch(loginUserThunk()),
  onLogout: () => dispatch(logoutUserThunk()),

  onTraceMoeSearch: (imageUrl) =>
    dispatch(fetchTraceMoeResult(imageUrl)),

  onUseTraceMoeAnime: (filename) => {
    dispatch(setQuery(filename));
    dispatch(clearTraceMoe());
  },

  onClearTraceMoe: () => dispatch(clearTraceMoe())
});

export const HeaderPresenter =
  connect(mapStateToProps, mapDispatchToProps)(HeaderView);