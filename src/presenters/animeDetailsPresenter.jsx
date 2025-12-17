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
import { AnimeDetailsView } from "../views/animeDetailsView.jsx";
import {
  setSelectedAnimeId,
  setQuizCategory,
  setQuizMode,
  setQuizType
} from "../redux/slices/detailsSlice.js";
import { SuspenseView } from "../views/suspenseView.jsx";
import { startQuizThunk } from "/src/redux/thunks/quizThunks.js";

function mapStateToProps(state) {
  return {
    anime: state.details.details.promiseState.data,
    characters: state.details.characters.promiseState.data,
    quizSettings: state.details.quizSettings,
    isOpen: state.details.isOpen,
    isLoading: state.details.details.promiseState.promise || state.details.characters.promiseState.promise
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClose: () => dispatch(setSelectedAnimeId(null)),
  onSelectCategory: (value) => dispatch(setQuizCategory(value)),
  onSelectMode: (value) => dispatch(setQuizMode(value)),
  onSelectType: (value) => dispatch(setQuizType(value)),
  // Pass dispatch itself to component for dynamic props
  dispatch
});

function AnimeDetailsPresenterComponent(props) {
  if (!props.isOpen) return null;

  // Wait for data to load
  if (!props.anime || !props.characters) return <SuspenseView />;

  const handlePlayACB = () => {
    const { characters, quizSettings, anime, dispatch, onClose } = props;

    if (!quizSettings || !quizSettings.category || !quizSettings.mode || !quizSettings.type) {
      alert("Please select category, mode, and type before playing!");
      return;
    }

    // Close modal first
    onClose();

    // Start quiz
    dispatch(startQuizThunk({ characters, quizSettings, anime }));
  };

  return <AnimeDetailsView {...props} onPlay={handlePlayACB} />;
}

export const AnimeDetailsPresenter =
    connect(mapStateToProps, mapDispatchToProps)(AnimeDetailsPresenterComponent);
