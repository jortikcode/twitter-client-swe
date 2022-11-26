import SearchForm from './SearchForm';
import TweetList from './TweetList';
import {
    submitSearch,
    checkFiltersNotShowing,
    checkSuccessfulSearch,
    usernameTweetsFill,
    keywordFill,
    toggleSearchType
} from '../utils/tests/form';
import {
    checkTweetsNotShowing
} from '../utils/tests/tweetList'
import { renderWithRouterAndProviders as render } from '../../test-utils';
import { screen } from '@testing-library/react';

describe("TweetList component", () => {
    beforeEach(() => {
        render(<>
            <SearchForm />
            <TweetList />
        </>);
      });

    test("shouldn't display tweets without a search", () => {
        checkFiltersNotShowing();
        checkTweetsNotShowing();
    });

    test("should show tweets when searching user tweets", async () => {
        usernameTweetsFill();
        submitSearch();
        checkSuccessfulSearch();
        const tweets = await screen.findAllByText(/^Giorgia Meloni/i);
        expect(tweets.length).toBeGreaterThan(0);
    });

    test("should show tweets when searching for keyword", async () => {
        toggleSearchType();
        keywordFill();
        submitSearch();
        checkSuccessfulSearch();
        const tweets = await screen.findAllByText(/meloni/i);
        expect(tweets.length).toBeGreaterThan(0);
    });

    test("should show profile pic of tweets", async () => {
        usernameTweetsFill();
        submitSearch();
        checkSuccessfulSearch();
        const profilePics = await screen.findAllByAltText(/^profile pic$/i);
        for (const profilePic of profilePics)
            expect(profilePic).toHaveAttribute("src");
    });
});