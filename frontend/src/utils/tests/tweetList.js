import { screen } from "@testing-library/react"
import { tweetListContainerTestId } from "./constants"

export const checkTweetsNotShowing = () => {
    const tweetListContainer = screen.queryByTestId(tweetListContainerTestId);
    expect(tweetListContainer).not.toBeInTheDocument();
}