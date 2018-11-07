export default el =>
    []
        .concat(
            ...Array.from(el.ownerDocument.styleSheets).map(s => {
                let rules = []

                try {
                    rules = Array.from(s.cssRules || [])
                } catch (e) {
                    // Ignore results on security error
                }

                return rules
            }),
        )
        .filter(r => {
            let matches = false
            try {
                matches = el.matches(r.selectorText)
            } catch (e) {
                // Ignore matching erros
            }

            return matches
        })
