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

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(setSelectedAnimeId(null)),
  onSelectCategory: (value) => dispatch(setQuizCategory(value)),
  onSelectMode: (value) => dispatch(setQuizMode(value)),
  onSelectType: (value) => dispatch(setQuizType(value)),

  // Start quiz using the GamePresenter thunk
  onPlay: (characters, quizSettings, anime) => {
    if (!characters || !quizSettings.category || !quizSettings.mode || !quizSettings.type) {
      console.warn("Cannot start quiz: missing data or settings");
      return;
    }

    // Dispatch the thunk from GamePresenter
    dispatch(
      startQuizThunk({
        characters,
        category: quizSettings.category,
        mode: quizSettings.mode,
        type: quizSettings.type,
        anime: {
          id: anime.id,
          title: anime.title,
          image: anime.image
        }
      })
    );
  }
});

function AnimeDetailsPresenterComponent(props) {
  if (!props.isOpen) return null;

  // Wait for data to load
  if (!props.anime || !props.characters) return <SuspenseView />;

  return <AnimeDetailsView {...props} onPlay={() => props.onPlay(props.characters, props.quizSettings, props.anime)} />;
}

export const AnimeDetailsPresenter =
  connect(mapStateToProps, mapDispatchToProps)(AnimeDetailsPresenterComponent);
