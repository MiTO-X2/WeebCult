/***********************************************************************
 * PURPOSE:
 *   - Present details for a single anime in a modal
 *   - Presenter = Redux-connected container for AnimeDetailsView
 *   - Dispatch thunks for details + characters
 *   - Fetch details & characters for selected anime
 *   - Pass all necessary props + callbacks to the view
 *   - Manage suspense logic (pending / error)
 *   - Handle quizSettings updates
 * 
 ***********************************************************************/

import { connect } from "react-redux";
import { AnimeDetailsView } from "../views/AnimeDetailsView.jsx";
import {
  setSelectedAnimeId,
  setQuizCategory,
  setQuizMode,
  setQuizType
} from "../redux/slices/detailsSlice.js";
import { SuspenseView } from "../views/suspenseView.jsx";

function mapStateToProps(state) {
  return {
    anime: state.details.details.promiseState.data,
    // characters: state.details.characters.promiseState.data,
    quizSettings: state.details.quizSettings,
    isOpen: state.details.isOpen,
    isLoading: state.details.details.promiseState.promise || state.details.characters.promiseState.promise
  };
}

const mapDispatchToProps = {
  onClose: () => setSelectedAnimeId(null),
  onSelectCategory: setQuizCategory,
  onSelectMode: setQuizMode,
  onSelectType: setQuizType
};

function AnimeDetailsPresenterComponent(props) {
  if (!props.isOpen) return null;

  // Wait for data to load
  if (!props.anime) return <SuspenseView />;

  return <AnimeDetailsView {...props} />;
}

export const AnimeDetailsPresenter =
  connect(mapStateToProps, mapDispatchToProps)(AnimeDetailsPresenterComponent);
