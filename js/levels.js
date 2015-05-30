var levels = [[9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 8, 9, 9, 9, 3, 3, 3, 3, 9, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 2, 2, 3, 9, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 2, 2, 3, 9, 1, 1, 9, 3, 3, 3, 3, 3, 9, 0, 0, 0, 0, 0, 9, 3, 2, 2, 3, 9, 1, 1, 9, 3, 2, 2, 2, 3, 9, 0, 9, 9, 9, 0, 9, 3, 3, 3, 3, 9, 1, 1, 9, 3, 2, 3, 2, 3, 9, 0, 9, 10, 9, 0, 9, 9, 9, 9, 9, 9, 1, 1, 9, 3, 2, 2, 2, 3, 9, 0, 9, 9, 9, 0, 9, 1, 1, 1, 1, 1, 1, 1, 9, 3, 3, 3, 3, 3, 9, 0, 0, 0, 0, 0, 9, 1, 9, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9],

              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 9, 8, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 1, 6, 2, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 6, 2, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 8, 8, 1, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 9, 9, 0, 9, 9, 9, 9, 9, 9, 10, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 8, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

              [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 8, 9, 4, 8, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 8, 9, 7, 6, 9, 8, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 9, 9, 7, 6, 9, 9, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 9, 9, 7, 6, 9, 9, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 8, 9, 7, 6, 9, 8, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 8, 5, 10, 8, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],

              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9,
               1, 9, 9, 4, 9, 9, 9, 9, 8, 9, 2, 2, 2, 1, 9, 9, 9, 9, 9, 9,
               1, 9, 3, 3, 3, 3, 9, 9, 9, 0, 9, 0, 9, 1, 9, 9, 9, 9, 9, 9,
               1, 9, 3, 9, 9, 9, 9, 9, 9, 9, 2, 6, 2, 1, 9, 9, 9, 9, 9, 9,
               1, 9, 3, 9, 0, 9, 9, 9, 9, 9, 2, 6, 2, 1, 9, 9, 9, 9, 9, 9,
               1, 9, 3, 9, 9, 0, 10, 9, 9, 9, 2, 9, 2, 1, 9, 9, 9, 9, 9, 9,
               1, 1, 1, 9, 0, 9, 0, 9, 9, 9, 2, 6, 2, 1, 9, 9, 9, 9, 9, 9,
               9, 9, 1, 9, 9, 0, 9, 0, 9, 9, 2, 6, 2, 1, 1, 9, 9, 9, 9, 9,
               9, 9, 1, 9, 0, 9, 0, 9, 9, 9, 2, 6, 2, 9, 1, 1, 1, 1, 1, 1,
               9, 9, 1, 0, 9, 0, 9, 2, 2, 2, 2, 6, 2, 9, 9, 9, 0, 9, 9, 1,
               9, 9, 1, 9, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 9, 9, 9, 9, 1,
               9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9,
               1, 9, 9, 4, 9, 9, 9, 9, 9, 9, 2, 2, 2, 1, 9, 9, 9, 9, 9, 9,
               1, 9, 3, 3, 3, 3, 9, 9, 9, 0, 9, 0, 9, 1, 9, 9, 9, 9, 9, 9,
               1, 9, 3, 9, 9, 9, 9, 9, 9, 9, 2, 6, 2, 1, 9, 9, 9, 9, 9, 9,
               1, 9, 3, 9, 0, 9, 9, 9, 9, 9, 2, 6, 2, 1, 9, 9, 9, 9, 9, 9,
               1, 8, 3, 9, 9, 0, 9, 9, 9, 9, 2, 8, 2, 1, 9, 9, 9, 9, 9, 9,
               1, 1, 1, 9, 0, 9, 0, 9, 9, 9, 2, 6, 2, 1, 9, 9, 9, 9, 9, 9,
               9, 9, 1, 9, 9, 0, 9, 0, 9, 9, 2, 6, 2, 1, 1, 9, 9, 9, 9, 9,
               9, 9, 1, 9, 0, 10, 0, 9, 9, 9, 2, 6, 2, 9, 1, 1, 1, 1, 1, 1,
               9, 9, 1, 0, 9, 0, 9, 0, 9, 9, 2, 6, 2, 9, 9, 9, 0, 9, 8, 1,
               9, 9, 1, 9, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 9, 9, 9, 9, 1,
               9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];