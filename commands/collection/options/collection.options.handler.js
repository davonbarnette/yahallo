const OptionsHandler = require("../../../utils/options.handler");

const COLLECTION_FILTER_OPTIONS = {
    RARITY: "rarity",
    ANIME: "anime",
    CONDITION: "condition",
}

const COLLECTION_OPTION_NAMES = {
    FILTER: "filter",
}

class CollectionOptionsHandler extends OptionsHandler {

    getStrapiFiltersFromFilter() {

        let option = this.getOptionByName(COLLECTION_OPTION_NAMES.FILTER)
        if (option) {
            const {value} = option;
            const [filterOption, search] = value.split(":");

            if (filterOption && search) {
                let curOption = filterOption.toUpperCase();
                switch (curOption) {
                    case COLLECTION_FILTER_OPTIONS.RARITY.toUpperCase():
                        return {
                            card: {
                                rarity: {
                                    $containsi: search
                                }
                            }
                        }
                    case COLLECTION_FILTER_OPTIONS.ANIME.toUpperCase():
                        return {
                            card: {
                                character: {
                                    animeTitle: {
                                        $containsi: search
                                    }
                                }
                            }
                        }
                    case COLLECTION_FILTER_OPTIONS.CONDITION.toUpperCase():
                        return {
                            condition: {
                                $containsi: search
                            }
                        }
                }
            }
        }
        return undefined;
    }

}

module.exports = CollectionOptionsHandler;