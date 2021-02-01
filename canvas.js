function Canvas() {
    // Create grid of people with randomized parties
    this.people_grid = []
    const people_count = self.parameters.grid_width ** 2
    const red_count = round(self.parameters.percentage_red / 100 * people_count)
    parties = [RED] * red_count + [BLUE] * (people_count - red_count)
    parties = fast_shuffled(parties)

    square_width = self.parameters.canvas_width / self.parameters.grid_width
    for grid_y in range(0, self.parameters.grid_width):
        row = []
        for grid_x in range(0, self.parameters.grid_width):
            p1 = (grid_x * square_width, grid_y * square_width)
            p2 = ((grid_x + 1) * square_width, (grid_y + 1) * square_width)
            party = parties[grid_x + grid_y * self.parameters.grid_width]
            row.append(Person(self, p1, p2, grid_x, grid_y, party=party))
        self.people_grid.append(row)
    for person in self.iter_people():
        person.secondary_init()
}
