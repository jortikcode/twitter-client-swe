import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { renderWithRouterAndProviders as render } from '../../test-utils';
import SearchForm from './SearchForm';
import { act } from 'react-dom/test-utils';
import { ONE_DAY_MILLISECONDS, ONE_WEEK_MILLISECONDS } from '../utils/constants';

import {
    fromDateErrorText,
    toDateErrorText,
    maxResultsErrorText,
    maxResultsTreshold,
    ofEverDateTestId,
    maxResultsLabel,
    toDateLabel,
    fromDateLabel,
    filtersToggleTestId,
    keywordPlaceholder,
    unsuccessfulText
} from '../utils/tests/constants'

import {
    submitSearch,
    showFilters,
    checkFiltersShowing,
    checkFiltersNotShowing,
    usernameTweetsFill,
    keywordFill,
    toggleSearchType,
    checkSuccessfulSearch
} from '../utils/tests/form'

describe('SearchForm component', () => {
    beforeEach(() => {
        render(<SearchForm />);
      });

    test('should render without errors', () => {
        expect(screen.getByText('Cosa vorresti cercare?')).toBeInTheDocument();
      });

    test('should show error when no query is filled', async () => {
        submitSearch();
        expect(await screen.findByText(unsuccessfulText)).toBeInTheDocument();
      });
    
    test('should allow username search of tweets', async () => {
        usernameTweetsFill();
        submitSearch();
        checkSuccessfulSearch();
      });
      
    test('should allow keyword search of tweets', async () => {
        toggleSearchType();
        const keywordInput = screen.getByPlaceholderText(keywordPlaceholder); 
        expect(keywordInput).toBeInTheDocument();
        keywordFill();
        submitSearch();
        checkSuccessfulSearch();
      });
    
    test("shouldn't show filters when they're disabled", () => {
        checkFiltersNotShowing();
    })

    test("should show filters when they're enabled", () => {
        const filtersToggleButton = screen.getByTestId(filtersToggleTestId);
        act(() => {
            userEvent.click(filtersToggleButton);
        });
        checkFiltersShowing();
      });
    
    test("shouldn't allow dates older than one week ago", async () => {
        showFilters();
        usernameTweetsFill();
        let notAllowedDate = new Date(Date.now() - ONE_WEEK_MILLISECONDS - ONE_DAY_MILLISECONDS);
        notAllowedDate = notAllowedDate.toISOString().split('T')[0];
        fireEvent.input(screen.getByLabelText(fromDateLabel), {
            target: {
                value: notAllowedDate
            }});
        submitSearch();
        expect(await screen.findByText(fromDateErrorText)).toBeInTheDocument();
      });

    test("shouldn't allow future dates", async () => {
        showFilters();
        usernameTweetsFill();
        let notAllowedDate = new Date(Date.now() + ONE_DAY_MILLISECONDS);
        notAllowedDate = notAllowedDate.toISOString().split('T')[0];
        fireEvent.input(screen.getByLabelText(toDateLabel), {
            target: {
                value: notAllowedDate
            }});
        submitSearch();
        expect(await screen.findByText(toDateErrorText)).toBeInTheDocument();
      });

    test("shouldn't allow to show a huge number of tweets", async () => {
        showFilters();
        usernameTweetsFill();
        let notAllowedMaxResults = maxResultsTreshold + 1;
        fireEvent.input(screen.getByLabelText(maxResultsLabel), {
            target: {
                value: notAllowedMaxResults
            }});
        submitSearch();
        expect(await screen.findByText(maxResultsErrorText)).toBeInTheDocument();
      });
    
    test("shouldn't allow to toggle no interval for keyword search", () => {
        showFilters();
        toggleSearchType();
        const ofEverDateFilter = screen.getByTestId(ofEverDateTestId);
        expect(ofEverDateFilter).toBeDisabled();
      });

    test("should allow to toggle no interval for user tweets search", async () => {
        showFilters();
        const ofEverDateFilter = screen.getByTestId(ofEverDateTestId);
        expect(ofEverDateFilter).toBeEnabled();
        usernameTweetsFill();
        submitSearch();
        checkSuccessfulSearch();
      });
});
