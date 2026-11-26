# Correlation matrices

`index.csv` identifies each station/phase and its files. `event_order.csv`
maps matrix indices to the sequential and original event IDs.

The sparse edge files contain **accepted observations only**, one row for
each i < j. An absent pair is missing, not a zero coefficient. Rejected pairs
and pairs that could not be measured do not enter these matrices. Consult the
run's decision and preprocessing ledgers to understand those omissions.

Optional dense CSVs have an event-ID header row and first column. `NA` means
missing, including the diagonal: no self-correlations were calculated.
Correlation coefficients are symmetric. Differential times and lags are
antisymmetric, so swapping i and j reverses their sign. Seconds are used.

Each pair has its own lag. The coefficient uses the lag policy recorded in
conventions.toml. Such a matrix need not be positive semidefinite.
Do not silently fill missing entries with zero or treat exported weights as
independently calibrated timing precision. No station/phase averaging or
clustering has been performed here.
