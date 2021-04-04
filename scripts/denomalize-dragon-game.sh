#/bin/sh

TMP=data
mkdir -p $TMP

for F in lab/resources/dragon_bonus_attack.json \
             lab/resources/dragon_family.json \
             lab/resources/dragon_stats_one.json \
             lab/resources/dragon_current_power.json
do
    BASENAME=$(basename $F .json)
    CSV=${TMP}/${BASENAME}.csv
    jq -r '(map(keys) | add | unique) as $cols | map(. as $row | $cols | map($row[.])) as $rows | $cols, $rows[] | @csv' $F \
        | xsv select '!description_str' > ${CSV}
    # echo $CSV
    # head -n 1 $CSV
done


xsv join breath_attack_str ${TMP}/dragon_family.csv breath_attack_str ${TMP}/dragon_bonus_attack.csv | xsv select '!breath_attack_str[1]' > ${TMP}/joined_family.csv
xsv join family_str ${TMP}/dragon_stats_one.csv family_str ${TMP}/joined_family.csv | xsv select '!family_str[1]' > ${TMP}/joined_dragon.csv
xsv join dragon_name_str ${TMP}/dragon_current_power.csv dragon_name_str ${TMP}/joined_dragon.csv | xsv select '!dragon_name_str[1]' > ${TMP}/joined_game.csv

cp ${TMP}/joined_game.csv ${TMP}/denomalize-dragon-game.csv
# xsv table ${TMP}/denomalize-dragon-game.csv
