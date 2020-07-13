import math
import simplejson as json

data = json.load(open("data.json"))

start = min([position["time"] for player in data for position in player["positions"]])
for player in data:
    for position in player["positions"]:
        position["time"] = position["time"] - start

times = [position["time"] for player in data for position in player["positions"]]
time_range = (min(times), max(times))
time_delta = time_range[1] - time_range[0]
seconds = [i for i in range(0, math.ceil(time_delta) + 1)]


def float_range (start, stop, step, precission = 2):
    distance = abs(start - stop)
    direction = start > stop and -1 or 1
    ran = 0
    step = abs(step)
    value = start

    while ran < distance:
        yield float(value)
        value = round((value + step * direction) * math.pow(10, precission)) / math.pow(10, precission)
        ran += step

    yield stop


def interpolate_positions (start, stop):
    if math.isnan(start["x"]) or math.isnan(start["y"]):
        return [{
            "time": i,
            "x": float("NaN"),
            "y": float("NaN")
        } for i in range(math.floor(stop["time"] - start["time"]))]

    else:
        return [
            {
                "time": round(step[0]),
                "x": step[1],
                "y": step[2]
            } for step in zip(
                float_range(
                    start["time"],
                    stop["time"],
                    1,
                    precission=0
                ),
                float_range(
                    start["x"],
                    stop["x"],
                    abs(stop["x"] - start["x"]) / max(1e-10, (stop["time"] - start["time"])),
                    precission=5
                ),
                float_range(
                    start["y"],
                    stop["y"],
                    abs(stop["y"] - start["y"]) / max(1e-10, (stop["time"] - start["time"])),
                    precission=5
                )
            )
        ]


def armonize_positions (positions, seconds):
    if positions[0]["time"] != 0:
        positions.insert(0, {
            "time": .0,
            "x": float("NaN"),
            "y": float("NaN")
        })

    balanced_positions = [positions[0]]

    index = 1
    second = 1
    end = max(seconds)
    while second < end:
        try:
            current_position = positions[index]
            if current_position["time"] < second:
                while current_position["time"] < second:
                    index += 1
                    current_position = positions[index]
                current_position["time"] = second
                second += 1
            elif current_position["time"] > second:
                current_position["time"] = math.ceil(current_position["time"])
                for position in interpolate_positions(balanced_positions[-1], current_position):
                    balanced_positions.append(position)
                second = current_position["time"]
                index += 1
            else:
                balanced_positions.append(position)
                second += 1
                index += 1
        except IndexError as e:
            balanced_positions.append({
                "time": second,
                "x": float("NaN"),
                "y": float("NaN")
            })
        except Exception as e:
            print(e)

    # try:
    #     while positions[index]:
    #         position = positions[index]
    #         position["time"] = math.floor(position["time"])
    #         balanced_positions.append(position)
    #         for between in interpolate_positions(position, positions[index + 1]):
    #             balanced_positions.append(between)
    #         index += 1
    # except IndexError as e:
    #     return balanced_positions


data = [
    {
        **player, **{
        "positions": armonize_positions(player["positions"], seconds)}
    } for player in data
]