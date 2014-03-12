var multiplyApp = angular.module('multiplyApp', []);

multiplyApp.service('ProblemBuilder', function (AnswerBuilder) {
    var self = this;
    self.build = function(numbers) {
        var problems = [];
        _.each(numbers, function(number){
            for (var i = 1; i < 13; i++) {
                problems.push({problem: number + ' x ' + i, answer: number * i, used: false});
            }
        });
        return _.shuffle(problems);
    };
    self.select = function(problems) {
        return _.find(problems, function(problem) { return !problem.used; } );
    };
    self.init = function($scope) {
        $scope.won = false;
        $scope.problems = self.build([8]);
        $scope.currentProblem = self.select($scope.problems);
        $scope.answers = AnswerBuilder.build($scope.problems);
    };
});

multiplyApp.service('AnswerBuilder', function () {
    this.build = function(problems) {
        var answers = [];
        _.each(_.shuffle(problems), function(problem) {
            answers.push({number: problem.answer, used: false});
        });
        return answers;
    };
});


multiplyApp.controller('AppCtrl', function ($scope, ProblemBuilder) {

    ProblemBuilder.init($scope);
    $scope.answerClick = function(answer) {
        if (answer.number === $scope.currentProblem.answer) {
            answer.used = true;
            $scope.currentProblem.used = true;
            $scope.currentProblem = ProblemBuilder.select($scope.problems);
            if ($scope.currentProblem === undefined) {
                $scope.won = true;
            }
        }
    };
    $scope.newSetClick = function() {
        ProblemBuilder.init($scope);
    };
});