import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import {
    keywordPlaceholder,
    usernamePlaceholder,
    unsuccessfulText,
    successfulText,
    maxResultsLabel,
    fromDateLabel,
    toDateLabel,
    ofEverDateTestId,
    filtersToggleTestId,
    typeSearchToggleTestId
} from './constants'

export const submitSearch = () => {
    // Ci ricaviamo il pulsante di ricerca
    const searchButton = screen.getByText(/^Cerca$/);
    act(() => {
        userEvent.click(searchButton);
    })
}

export const showFilters = () => {
    const filtersToggleButton = screen.getByTestId(filtersToggleTestId);
    act(() => {
        userEvent.click(filtersToggleButton);
    });
}

export const checkSuccessfulSearch = async () => {
    expect(await screen.findByText(successfulText, {
        timeout: 5000
    })).toBeInTheDocument();
    expect(screen.queryByText(unsuccessfulText)).not.toBeInTheDocument();
}

export const usernameTweetsFill = () => {
    fireEvent.input(screen.getByPlaceholderText(usernamePlaceholder), {
        target: {
            value: "giorgiameloni"
        }});
}

export const keywordFill = () => {
    fireEvent.input(screen.getByPlaceholderText(keywordPlaceholder), {
        target: {
            value: "#meloni"
        }});
}

export const toggleSearchType = () => {
    const typeSearchButton = screen.getByTestId(typeSearchToggleTestId);
    act(() => {
        userEvent.click(typeSearchButton);
    })
}

export const checkFiltersShowing = () => {
    const maxResultsFilter = screen.getByLabelText(maxResultsLabel);
    expect(maxResultsFilter).toBeInTheDocument();
    const fromDateFilter = screen.getByLabelText(fromDateLabel);
    expect(fromDateFilter).toBeInTheDocument();
    const toDateFilter = screen.getByLabelText(toDateLabel);
    expect(toDateFilter).toBeInTheDocument();
    const ofEverDateFilter = screen.getByTestId(ofEverDateTestId);
    expect(ofEverDateFilter).toBeInTheDocument();
}

export const checkFiltersNotShowing = () => {
    const maxResultsFilter = screen.queryByLabelText(maxResultsLabel);
    expect(maxResultsFilter).not.toBeInTheDocument();
    const fromDateFilter = screen.queryByLabelText(fromDateLabel);
    expect(fromDateFilter).not.toBeInTheDocument();
    const toDateFilter = screen.queryByLabelText(toDateLabel);
    expect(toDateFilter).not.toBeInTheDocument();
    const ofEverDateFilter = screen.queryByTestId(ofEverDateTestId);
    expect(ofEverDateFilter).not.toBeInTheDocument();
}