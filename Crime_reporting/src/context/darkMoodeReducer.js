const DarkMoodReducer = (state, action) => {
    switch (action.type) {
        case "LIGHT": {
            return {
                darkMoode: false,
            };
        }
        case "DARK": {
            return {
                darkMoode: true,
            };
        }

        case "TOGGLE": {
            return {
                darkMoode: !state.darkMoode,
            };
        }
        default:
            return state;

    }
};

export default DarkMoodReducer;